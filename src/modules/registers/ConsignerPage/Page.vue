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
	import { auxiliaryRepository, consignerRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { AddressModel, ConsignerModel } from '@/core/models'
	import {
		formatStatus,
		valueUpdater,
		type StatusFormatted,
	} from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import {
		ConsignerDeleteAction,
		ConsignerForm,
		ConsignerUpdateAction,
		ConsignerViewAction,
	} from './components/table'

	type ConsignerTable = {
		id: number
		name: string
		entityTypeName: string
		address: string
		start?: string | null
		end?: string | null
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
		data: consigners,
		isLoading: isConsignersLoading,
		isPlaceholderData: isConsignersPlaceholderData,
	} = useQuery({
		queryKey: consignerRepository.getQueryKey(
			'consigners',
			{
				page,
				limit: perPage,
			},
			status,
		),
		queryFn: ({ signal }) =>
			consignerRepository.getAllConsigners({
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
		mutateAsync: handleDeleteConsigner,
		isPending: isDeleteConsignerLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			consignerRepository.activateConsigner({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: consignerRepository.getQueryKey(
					'consigners',
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
						error.message ?? 'Erro ao atualizar status do consignante master!',
				},
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Status do consignante apagado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleUpdateConsigner,
		isPending: isUpdateConsignerLoading,
	} = useMutation({
		mutationFn: (data: ConsignerModel) =>
			consignerRepository.updateConsigner(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: consignerRepository.getQueryKey(
					'consigners',
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
				{ title: error.message ?? `Erro ao atualizar o consignante!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Consignante atualizado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleCreateConsigner,
		isPending: isCreateConsignerLoading,
	} = useMutation({
		mutationFn: (data: ConsignerModel) =>
			consignerRepository.createConsigner(data),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: consignerRepository.getQueryKey(
					'consigners',
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
				{ title: error.message ?? `Erro ao criar o consignante!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Consignante criado com sucesso!` },
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

	const formattedAllTypeOfConsigner = computed<ConsignerTable[]>(() => {
		return (consigners.value ?? []).map(
			({
				id,
				name,
				cnpj,
				addresses,
				entityTypeName,
				startOfBusiness,
				endOfBusiness,
				status,
			}) => ({
				id: id as number,
				name,
				entityTypeName: entityTypeName as string,
				address: `${addresses.cityName} - ${addresses.stateName}`,
				start: startOfBusiness,
				end: endOfBusiness,
				// cnpj: cnpj.replace(
				// 	/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
				// 	'$1.$2.$3/$4-$5',
				// ),
				status: formatStatus(status as number),
			}),
		)
	})

	const columns: ColumnDef<ConsignerTable>[] = [
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
						disabled: formattedAllTypeOfConsigner.value.length <= 0,
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
			meta: 'Consignante',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfConsigner.value.length <= 0,
						// onClick: () => handleSort('name'),
					},
					() => [
						'Consignante',
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
						disabled: formattedAllTypeOfConsigner.value.length <= 0,
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
						disabled: formattedAllTypeOfConsigner.value.length <= 0,
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
			accessorKey: 'start',
			meta: 'Inicio',
			size: 50,
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfConsigner.value.length <= 0,
						// onClick: () => handleSort('start'),
					},
					() => [
						'Inicio',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('start')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('start')),
			enableHiding: false,
		},
		{
			accessorKey: 'end',
			meta: 'Fim',
			size: 50,
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfConsigner.value.length <= 0,
						// onClick: () => handleSort('end'),
					},
					() => [
						'Fim',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('end')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('end')),
			enableHiding: false,
		},
		{
			accessorKey: 'status',
			meta: 'Tipo de entidade',
			size: 20,
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: ['w-full justify-start px-1 font-bold'],
						disabled: formattedAllTypeOfConsigner.value.length <= 0,
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
					h(ConsignerViewAction, {
						dataId: data.id,
						isLoading: isUpdateConsignerLoading.value,
						isActive: data.status.raw === 1,
					}),
					h(ConsignerUpdateAction, {
						dataId: data.id,
						tableConsignerName: data.name,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdateConsignerLoading.value,
						isActive: data.status.raw === 1,
					}),
					h(ConsignerDeleteAction, {
						dataId: data.id,
						tableConsignerName: data.name,
						'onOn-delete': onDeleteSubmit,
						isLoading: isDeleteConsignerLoading.value,
						isActive: data.status.raw === 1,
					}),
				])
			},
		},
	]

	const table = useVueTable({
		get data() {
			return formattedAllTypeOfConsigner.value
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
			masterConsignerId: z
				.string({ message: 'O consignante master é obrigatório' })
				.min(1, { message: 'O consignante master é obrigatório.' }),
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
	})

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreateConsigner(
			new ConsignerModel({ ...values, addresses: new AddressModel(values) }),
		).then(() => {
			openCreateModal.value = false
		})
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema> & { addressId: number },
		onClose: () => void,
	) => {
		return handleUpdateConsigner(
			new ConsignerModel({
				id,
				...values,
				addresses: new AddressModel({ ...values, id: `${values.addressId}` }),
			}),
		).then(() => {
			onClose()
		})
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteConsigner({ id })
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
	// 			selectConsignersRefetch()
	// 			return
	// 		}

	// 		selectSort.value = undefined
	// 		selectConsignersRefetch()
	// 		return
	// 	}

	// 	selectSort.value = `[${key}][ASC]`
	// 	selectConsignersRefetch()
	// }

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isConsignersPlaceholderData.value) {
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
		<breadcrumbs :paginas="['Cadastro', 'Consignante']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex gap-10 items-center justify-center">
					<titulo title="Gerenciar consignante" />

					<form-wrapper
						v-model="openCreateModal"
						:is-loading="isCreateConsignerLoading"
						:title="`Criar um novo consignante`"
						description="Crie o conteúdo de um novo consignante."
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
										<p>Cadastre um novo consignante</p>
									</tooltip-content>
								</tooltip>
							</tooltip-provider>
						</template>

						<template #fields>
							<consigner-form
								:metadata="form.values"
								:disabled="isCreateConsignerLoading"
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
					:is-loading="isConsignersLoading"
				/>

				<div :class="['flex w-full items-center px-4']">
					<table-pagination
						v-model="page"
						:disabled="formattedAllTypeOfConsigner.length <= 0"
						:total-itens="pageMetadata.totalItens"
						:items-per-page="perPage"
						@update-paginate="handlePagination"
					/>
				</div>
			</div>
		</div>
	</main>
</template>
