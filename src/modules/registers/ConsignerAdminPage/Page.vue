<script lang="ts" setup>
	import { computed, h, ref } from 'vue'
	import * as z from 'zod'
	import { useForm } from 'vee-validate'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useRouteQuery } from '@vueuse/router'
	import {
		keepPreviousData,
		useMutation,
		useQuery,
		useQueryClient,
	} from '@tanstack/vue-query'
	import { ColumnDef, getCoreRowModel, useVueTable } from '@tanstack/vue-table'

	import {
		SelectRoot,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger,
		SelectValue,
	} from '@/core/components/fields/select'
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger,
	} from '@/core/components/tooltip'
	import { FormWrapper } from '@/core/components/form-wrapper'
	import {
		TableWrapper,
		TablePagination,
	} from '@/core/components/table-wrapper'
	import Breadcrumbs from '@/core/components/Breadcrumbs.vue'
	import Titulo from '@/core/components/Titulo.vue'
	import { auxiliaryRepository, consignerAdminRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import {
		AddressModel,
		ConsignerAdminModel,
		ServiceModel,
	} from '@/core/models'
	import {
		formatCNPJ,
		formatCPF,
		formatStatus,
		valueUpdater,
		type StatusFormatted,
	} from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import {
		ConsignerAdminDeleteAction,
		ConsignerAdminForm,
		ConsignerAdminUpdateAction,
		ConsignerAdminViewAction,
	} from './components/table'

	type ConsignerAdminTable = {
		id: number
		name: string
		cnpj: string
		entityTypeName: string
		services: ServiceModel[]
		status: StatusFormatted
	}

	const statusItems = [
		{ value: 1, label: 'Ativado' },
		{ value: 0, label: 'Desativado' },
	] as const

	// const changeValues = {
	// 	ASC: 'DESC',
	// 	DESC: 'NONE',
	// 	NONE: 'ASC',
	// } as const

	const openCreateModal = ref(false)
	const rowSelection = ref({})
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })
	// const selectSort = useRouteQuery<string | undefined>('cgn-sort')
	const status = useRouteQuery<string | undefined>('cgn-status', undefined)
	const page = useRouteQuery('cgn-page', 1, { transform: Number })
	const perPage = useRouteQuery('cgn-per-page', 8, {
		transform: Number,
	})
	const queryClient = useQueryClient()
	const notify = useNotify()

	const {
		data: consigneradmins,
		isLoading: isConsignerAdminsLoading,
		isPlaceholderData: isConsignerAdminsPlaceholderData,
	} = useQuery({
		queryKey: consignerAdminRepository.getQueryKey(
			'consigneradmins',
			{
				page,
				limit: perPage,
			},
			status,
		),
		queryFn: ({ signal }) =>
			consignerAdminRepository.getAllConsignerAdmins({
				signal,
				params: {
					page: page.value,
					per_page: perPage.value,
					status: status.value,
				},
				metaCallback: (meta) => {
					pageMetadata.value = {
						totalItens: meta.total,
						totalPages: meta.last_page,
					}
				},
			}),
		placeholderData: keepPreviousData,
	})

	const { data: entityTypes, isLoading: isEntityTypesLoading } = useQuery({
		queryKey: auxiliaryRepository.getQueryKey('entity-types'),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllEntityTypes({
				signal,
				params: { perPage: '100' },
			}),
	})

	const {
		mutateAsync: handleDeleteConsignerAdmin,
		isPending: isDeleteConsignerAdminLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			consignerAdminRepository.activateConsignerAdmin({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: consignerAdminRepository.getQueryKey(
					'consigneradmins',
					{
						page,
						limit: perPage,
					},
					status,
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{
					title:
						error.message ??
						'Erro ao atualizar status do consignatária master!',
				},
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Status do consignatária apagado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleUpdateConsignerAdmin,
		isPending: isUpdateConsignerAdminLoading,
	} = useMutation({
		mutationFn: (data: ConsignerAdminModel) =>
			consignerAdminRepository.updateConsignerAdmin(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: consignerAdminRepository.getQueryKey(
					'consigneradmins',
					{
						page,
						limit: perPage,
					},
					status,
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: error.message ?? `Erro ao atualizar o consignatária!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Consignatária atualizado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleCreateConsignerAdmin,
		isPending: isCreateConsignerAdminLoading,
	} = useMutation({
		mutationFn: (data: ConsignerAdminModel) =>
			consignerAdminRepository.createConsignerAdmin(data),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: consignerAdminRepository.getQueryKey(
					'consigneradmins',
					{
						page,
						limit: perPage,
					},
					status,
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: error.message ?? `Erro ao criar o consignatária!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Consignatária criado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const formattedAllEntityTypesMap = computed(() => {
		return Object.fromEntries(
			(entityTypes.value ?? []).map(({ id, name }) => [
				`${id as number}`,
				name,
			]),
		)
	})

	const formattedAllTypeOfConsignerAdmin = computed<ConsignerAdminTable[]>(
		() => {
			return (consigneradmins.value ?? []).map(
				({
					id,
					name,
					cnpj,
					entityTypeId,
					entityTypeName,
					services,
					status,
				}) => ({
					id: id as number,
					name,
					cnpj: formatCNPJ(cnpj),
					entityTypeId,
					entityTypeName: entityTypeName as string,
					services,
					status: formatStatus(status as number),
				}),
			)
		},
	)

	const columns: ColumnDef<ConsignerAdminTable>[] = [
		{
			accessorKey: 'id',
			meta: 'Código',
			size: 20,
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfConsignerAdmin.value.length <= 0,
						// onClick: () => handleSort('id'),
					},
					() => [
						'Código',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('id')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('id')),
			enableHiding: false,
		},
		{
			accessorKey: 'name',
			meta: 'Consignatária',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfConsignerAdmin.value.length <= 0,
						// onClick: () => handleSort('name'),
					},
					() => [
						'Consignatária',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('name')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('name')),
			enableHiding: false,
		},
		{
			accessorKey: 'entityTypeName',
			meta: 'Tp. Entidade',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfConsignerAdmin.value.length <= 0,
						// onClick: () => handleSort('entityTypeName'),
					},
					() => [
						'Tp. Entidade',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('entityTypeName')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('entityTypeName')),
			enableHiding: false,
		},
		{
			accessorKey: 'address',
			meta: 'Cidade/UF',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfConsignerAdmin.value.length <= 0,
						// onClick: () => handleSort('address'),
					},
					() => [
						'Cidade/UF',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('address')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('address')),
			enableHiding: false,
		},
		{
			accessorKey: 'cnpj',
			meta: 'CNPJ',
			size: 50,
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfConsignerAdmin.value.length <= 0,
						// onClick: () => handleSort('cnpj'),
					},
					() => [
						'CNPJ',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('cnpj')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('cnpj')),
			enableHiding: false,
		},
		{
			accessorKey: 'service',
			meta: 'Tp. Serviços',
			size: 50,
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfConsignerAdmin.value.length <= 0,
						// onClick: () => handleSort('service'),
					},
					() => [
						'Tp. Serviços',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('service')],
						// }),
					],
				)
			},
			// cell: ({ row }) => h('div', row.getValue('service')),
			enableHiding: false,
		},
		{
			accessorKey: 'status',
			meta: 'Status',
			size: 20,
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: ['w-full justify-start px-1 font-bold'],
						disabled: formattedAllTypeOfConsignerAdmin.value.length <= 0,
						// onClick: () => handleSort('entityTypeId'),
					},
					() => [
						'Status',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('entityTypeId')],
						// }),
					],
				)
			},
			cell: ({ row, cell }) =>
				h(
					'div',
					{
						class:
							'flex justify-center items-center, max-w-32 rounded-md py-[0.3rem]',
						style: {
							color: row.getValue<StatusFormatted>('status').textColor,
							backgroundColor: row.getValue<StatusFormatted>('status').bgColor,
						},
					},
					row.getValue<StatusFormatted>('status')?.text,
				),
			enableHiding: false,
		},
		{
			id: 'actions',
			header: 'Ações',
			cell: ({ row }) => {
				const data = row.original
				return h('div', { class: 'relative max-w-4 flex gap-2' }, [
					h(ConsignerAdminViewAction, {
						dataId: data.id,
						isLoading: isUpdateConsignerAdminLoading.value,
						isActive: data.status.raw === "ativo",
					}),
					h(ConsignerAdminUpdateAction, {
						dataId: data.id,
						tableConsignerAdminName: data.name,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdateConsignerAdminLoading.value,
						isActive: data.status.raw === "ativo",
					}),
					h(ConsignerAdminDeleteAction, {
						dataId: data.id,
						tableConsignerAdminName: data.name,
						'onOn-delete': onDeleteSubmit,
						isLoading: isDeleteConsignerAdminLoading.value,
						isActive: data.status.raw === "ativo",
					}),
				])
			},
		},
	]

	const table = useVueTable({
		get data() {
			return formattedAllTypeOfConsignerAdmin.value
		},
		get columns() {
			return columns
		},
		getCoreRowModel: getCoreRowModel(),
		manualSorting: true,
		manualPagination: true,
		rowCount: pageMetadata.value.totalItens,
		getRowId: (row) => row.id.toString(),
		onRowSelectionChange: (updaterOrValue) =>
			valueUpdater(updaterOrValue, rowSelection),
		state: {
			get rowSelection() {
				return rowSelection.value
			},
		},
	})

	const formSchema = z
		.object({
			name: z
				.string({ message: 'O nome é obrigatório' })
				.min(1, { message: 'O nome é obrigatório.' }),
			shortName: z
				.string({ message: 'O nome é obrigatório' })
				.min(1, { message: 'O nome é obrigatório.' }),
			startOfBusiness: z
				.string({ message: 'O inicio é obrigatório' })
				.optional()
				.nullable(),
			endOfBusiness: z
				.string({ message: 'O fim é obrigatório' })
				.optional()
				.nullable(),
			cnpj: z
				.string({ message: 'O CNPJ é obrigatório.' })
				.min(1, { message: 'O CNPJ é obrigatório.' }),
			masterConsignerAdminId: z
				.string({ message: 'O consignatária master é obrigatório' })
				.min(1, { message: 'O consignatária master é obrigatório.' }),
			entityTypeId: z
				.string({ message: 'A entidade é obrigatória' })
				.min(1, { message: 'A entidade é obrigatória.' }),
			addressId: z
				.number({ message: 'O id endereço é obrigatório.' })
				.min(1, { message: 'O id endereço é obrigatório.' }),
			cityId: z
				.string({ message: 'A cidade é obrigatória.' })
				.min(1, { message: 'A cidade é obrigatória.' }),
			stateId: z
				.string({ message: 'O estado é obrigatório.' })
				.min(1, { message: 'O estado é obrigatório.' }),
			street: z
				.string({ message: 'O logradouro é obrigatório.' })
				.min(1, { message: 'O logradouro é obrigatório.' }),
			zipCode: z
				.string({ message: 'O CEP é obrigatório.' })
				.min(1, { message: 'O CEP é obrigatório.' }),
			services: z
				.array(z.string())
				.refine((value) => value.some((item) => item), {
					message: 'Selecione pelo menos 1 serviço.',
				}),
		})
		.refine(
			({ startOfBusiness, endOfBusiness }) => {
				if (
					startOfBusiness === null ||
					startOfBusiness === undefined ||
					endOfBusiness === null ||
					endOfBusiness === undefined
				) {
					return
				}

				const [h1, m1] = startOfBusiness.split(':').map(Number)
				const [h2, m2] = endOfBusiness.split(':').map(Number)

				const start = new Date()
				start.setHours(h1, m1, 0, 0)

				const end = new Date()
				end.setHours(h2, m2, 0, 0)

				return end > start
			},
			{
				path: ['endOfBusiness', 'startOfBusiness'],
				message: 'Expediente inválido.',
			},
		)

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
		initialValues: {
			services: [],
		},
	})

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreateConsignerAdmin(
			new ConsignerAdminModel({
				...values,
				// addresses: new AddressModel(values),
			}),
		).then(() => {
			openCreateModal.value = false
		})
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema> & { addressId: number },
		onClose: () => void,
	) => {
		return handleUpdateConsignerAdmin(
			new ConsignerAdminModel({
				id,
				...values,
				// addresses: new AddressModel({ ...values, id: `${values.addressId}` }),
			}),
		).then(() => {
			onClose()
		})
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteConsignerAdmin({ id })
	}

	// function getSort(key: string) {
	// 	const sortParameters = extractSort(selectSort.value as string)

	// 	switch (sortParameters?.[key]) {
	// 		case 'ASC': {
	// 			return 'sort-up'
	// 		}
	// 		case 'DESC': {
	// 			return 'sort-down'
	// 		}
	// 		default: {
	// 			return 'sort'
	// 		}
	// 	}
	// }

	// function extractSort<T = string>(
	// 	sort: string,
	// ):
	// 	| {
	// 			[x: string]: T
	// 	  }
	// 	| undefined {
	// 	if (!sort) return

	// 	const regexData = /^\[(\w+)\]\[(\w+)\]$/.exec(sort)

	// 	if (!regexData) return

	// 	return { [regexData[1]]: regexData[2] as T }
	// }

	// function handleSort(key: string) {
	// 	const sortParameters = extractSort<keyof typeof changeValues>(
	// 		selectSort.value as string,
	// 	)
	// 	const hasSearch = Object.hasOwn(sortParameters ?? {}, key)

	// 	if (hasSearch && sortParameters) {
	// 		const value = changeValues[sortParameters[key]]

	// 		if (changeValues[value] !== changeValues.NONE) {
	// 			selectSort.value = `[${key}][${value}]`
	// 			selectConsignerAdminsRefetch()
	// 			return
	// 		}

	// 		selectSort.value = undefined
	// 		selectConsignerAdminsRefetch()
	// 		return
	// 	}

	// 	selectSort.value = `[${key}][ASC]`
	// 	selectConsignerAdminsRefetch()
	// }

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isConsignerAdminsPlaceholderData.value) {
				page.value = to
			}
		}
	}

	function handleClear() {
		status.value = undefined
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Cadastro', 'Consignatárias Admin']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex gap-10 items-center justify-center">
					<titulo title="Consignatárias Habilitadas" />

					<form-wrapper
						v-model="openCreateModal"
						:is-loading="isCreateConsignerAdminLoading"
						:title="`Criar uma nova consignatária`"
						description="Crie o conteúdo de um novo consignatária."
						class="sm:max-w-[780px]"
						@form-submit="onCreateSubmit"
					>
						<template #trigger>
							<tooltip-provider>
								<tooltip>
									<tooltip-trigger as-child>
										<button-root
											variant="outline"
											@click="openCreateModal = true"
										>
											<font-awesome-icon
												class="text-primary_3-table w-5 h-5"
												:icon="['fas', 'circle-plus']"
											/>
										</button-root>
									</tooltip-trigger>
									<tooltip-content side="right">
										<p>Cadastre uma nova consignatária</p>
									</tooltip-content>
								</tooltip>
							</tooltip-provider>
						</template>

						<template #fields>
							<consigner-admin-form
								:metadata="form.values"
								:disabled="isCreateConsignerAdminLoading"
							/>
						</template>
					</form-wrapper>
				</div>

				<div class="header_actions flex items-center gap-4 flex-1 justify-end">
					<select-root class="flex-[1]" v-model="status">
						<select-trigger class="lg:max-w-80 flex-[2]">
							<select-value
								class="text-left"
								placeholder="Selecione um status..."
							/>
						</select-trigger>
						<select-content>
							<select-group>
								<select-label>Status:</select-label>
								<select-item
									v-for="statusItem of statusItems"
									:key="statusItem.value"
									:value="statusItem.value.toString()"
									>{{ statusItem.label }}</select-item
								>
							</select-group>
						</select-content>
					</select-root>

					<tooltip-provider>
						<tooltip>
							<tooltip-trigger as-child>
								<button-root variant="outline" @click="handleClear">
									<font-awesome-icon
										class="text-primary_3-table w-5 h-5"
										:icon="['fas', 'eraser']"
									/>
								</button-root>
							</tooltip-trigger>
							<tooltip-content side="right">
								<p>Apagar filtros</p>
							</tooltip-content>
						</tooltip>
					</tooltip-provider>
				</div>
			</div>

			<div class="pb-1">
				<table-wrapper
					:table="table"
					:column-size="columns.length"
					:row-limit="perPage"
					:is-loading="isConsignerAdminsLoading"
				/>

				<div :class="['flex w-full items-center px-4']">
					<table-pagination
						v-model="page"
						:disabled="formattedAllTypeOfConsignerAdmin.length <= 0"
						:total-itens="pageMetadata.totalItens"
						:items-per-page="perPage"
						@update-paginate="handlePagination"
					/>
				</div>
			</div>
		</div>
	</main>
</template>
