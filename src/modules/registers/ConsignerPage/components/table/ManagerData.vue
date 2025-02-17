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
	import {
		auxiliaryRepository,
		managerRepository,
		personRepository,
	} from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { AddressModel, ManagerModel } from '@/core/models'
	import {
		formatCPF,
		formatPhone,
		formatStatus,
		valueUpdater,
		type StatusFormatted,
	} from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import {
		ManagerUpdateAction,
		ManagerForm,
		ManagerDeleteAction,
	} from '@/modules/registers/ConsignerPage/components/table'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	type ManagerTable = {
		id: number
		name: string
		position: string
		department: string
		phone?: string
		cellphone?: string
		email?: string
		status: StatusFormatted
	}

	const statusItems = [
		{ value: 1, label: 'Ativado' },
		{ value: 0, label: 'Desativado' },
	] as const

	const changeValues = {
		ASC: 'DESC',
		DESC: 'NONE',
		NONE: 'ASC',
	} as const

	const openCreateModal = ref(false)
	const rowSelection = ref({})
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })
	const selectSort = useRouteQuery<string | undefined>('cgn-sort')
	const status = useRouteQuery<string | undefined>('cgn-status', undefined)
	const page = useRouteQuery('cgn-page', 1, { transform: Number })
	const perPage = useRouteQuery('cgn-per-page', 8, {
		transform: Number,
	})
	const queryClient = useQueryClient()
	const notify = useNotify()

	const props = defineProps({
		dataId: { type: Number, required: true },
	})

	const currentCode = computed(() => {
		return props.dataId
	})

	const {
		data: managers,
		isLoading: isManagersLoading,
		isPlaceholderData: isManagersPlaceholderData,
	} = useQuery({
		queryKey: managerRepository.getQueryKey(
			'managers',
			{
				page,
				limit: perPage,
			},
			status,
			currentCode
		),
		queryFn: ({ signal }) =>
			managerRepository.getAllManagers({
				signal,
				params: {
					page: page.value,
					per_page: perPage.value,
					status: status.value,
					vinculavel_id: currentCode.value,
					vinculavel_type: 1,
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

	const {
		mutateAsync: handleDeleteManager,
		isPending: isDeleteManagerLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			managerRepository.activateManager({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: managerRepository.getQueryKey(
					'managers',
					{
						page,
						limit: perPage,
					},
					status,
					currentCode
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{
					title: error.message ?? 'Erro ao atualizar status do gestor!',
				},
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Status do gestor apagado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleUpdateManager,
		isPending: isUpdateManagerLoading,
	} = useMutation({
		mutationFn: (data: ManagerModel) => managerRepository.updateManager(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: managerRepository.getQueryKey(
					'managers',
					{
						page,
						limit: perPage,
					},
					status,
					currentCode
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: error.message ?? `Erro ao atualizar o gestor!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Gestor atualizado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleCreateManager,
		isPending: isCreateManagerLoading,
	} = useMutation({
		mutationFn: (data: ManagerModel) => managerRepository.createManager(data),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: managerRepository.getQueryKey(
					'managers',
					{
						page,
						limit: perPage,
					},
					status,
					currentCode
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: error.message ?? `Erro ao criar o gestor!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Gestor criado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const formattedAllTypeOfManager = computed<ManagerTable[]>(() => {
		return (managers.value ?? []).map(
			({
				id,
				name,
				position,
				department,
				phone,
				cellphone,
				email,
				status,
			}) => ({
				id: id as number,
				name,
				position,
				department,
				phone: formatPhone(phone ?? ''),
				cellphone: formatPhone(cellphone ?? ''),
				email,
				status: formatStatus(status as number),
			}),
		)
	})

	const columns: ColumnDef<ManagerTable>[] = [
		{
			accessorKey: 'name',
			meta: 'Gestores',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfManager.value.length <= 0,
						onClick: () => handleSort('name'),
					},
					() => [
						'Gestores',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('name')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('name')),
			enableHiding: false,
		},
		{
			accessorKey: 'position',
			meta: 'Função',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfManager.value.length <= 0,
						onClick: () => handleSort('position'),
					},
					() => [
						'Função',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('position')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('position')),
			enableHiding: false,
		},
		{
			accessorKey: 'department',
			meta: 'Departamento',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfManager.value.length <= 0,
						onClick: () => handleSort('department'),
					},
					() => [
						'Departamento',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('department')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('department')),
			enableHiding: false,
		},
		{
			accessorKey: 'phone',
			meta: 'Telefone',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfManager.value.length <= 0,
						onClick: () => handleSort('phone'),
					},
					() => [
						'Telefone',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('phone')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('phone')),
			enableHiding: false,
		},
		{
			accessorKey: 'cellphone',
			meta: 'Celular',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfManager.value.length <= 0,
						onClick: () => handleSort('cellphone'),
					},
					() => [
						'Celular',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('cellphone')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('cellphone')),
			enableHiding: false,
		},
		{
			accessorKey: 'email',
			meta: 'E-mail',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfManager.value.length <= 0,
						onClick: () => handleSort('email'),
					},
					() => [
						'E-mail',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('email')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('email')),
			enableHiding: false,
		},
		{
			accessorKey: 'status',
			meta: 'Tipo de entidade',
			enableResizing: false,
			size: 0,
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfManager.value.length <= 0,
						onClick: () => handleSort('status'),
					},
					() => [
						'Status',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('entityTypeId')],
						}),
					],
				)
			},
			cell: ({ row, cell }) =>
				h(
					'span',
					{
						class:
							'flex justify-center items-center max-w-20 rounded-md px-2 py-1 text-xs font-semibold',
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
			size: 0,
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
					},
					() => ['Ações'],
				)
			},
			cell: ({ row }) => {
				const data = row.original
				return h(
					'div',
					{ class: 'relative flex gap-2 justify-end items-center' },
					[
						h(ManagerUpdateAction, {
							dataId: data.id,
							tableManagerName: data.name,
							'onOn-edit': onUpdateSubmit,
							isLoading: isUpdateManagerLoading.value,
							isActive: data.status.raw === 'ativo',
						}),
						h(ManagerDeleteAction, {
							dataId: data.id,
							tableManagerName: data.name,
							'onOn-delete': onDeleteSubmit,
							isLoading: isDeleteManagerLoading.value,
							isActive: data.status.raw === 'ativo',
						}),
					],
				)
			},
		},
	]

	const table = useVueTable({
		get data() {
			return formattedAllTypeOfManager.value
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

	const formSchema = z.object({
		personId: z
			.string({ message: 'A pessoa é obrigatória.' })
			.min(1, { message: 'A pessoa é obrigatória.' }),
		cpf: z
			.string({ message: 'O CPF é obrigatório.' })
			.min(1, { message: 'O CPF é obrigatório.' }),
		name: z
			.string({ message: 'O nome é obrigatório' })
			.min(1, { message: 'O nome é obrigatório.' }),
		position: z
			.string({ message: 'O função é obrigatório' })
			.min(1, { message: 'O função é obrigatório.' }),
		department: z
			.string({ message: 'O departamento é obrigatório' })
			.min(1, { message: 'O departamento é obrigatório.' }),
		phone: z
			.string({ message: 'O telefone é obrigatório.' })
			.min(1, { message: 'O telefone é obrigatório.' })
			.optional(),
		cellphone: z
			.string({ message: 'O celular é obrigatório' })
			.min(1, { message: 'O celular é obrigatório.' })
			.optional(),
		email: z
			.string({ message: 'O e-mail é obrigatório' })
			.email({ message: 'O e-mail tem que ser válido.' })
			.min(1, { message: 'O e-mail é obrigatório.' })
			.optional(),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
	})

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreateManager(
			new ManagerModel({ ...values, bondId: currentCode.value.toString() }),
		).then(() => {
			openCreateModal.value = false
		})
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema> & { addressId: number },
		onClose: () => void,
	) => {
		return handleUpdateManager(
			new ManagerModel({
				id,
				...values,
				bondId: currentCode.value.toString(),
			}),
		).then(() => {
			onClose()
		})
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteManager({ id })
	}

	async function handleSearchPerson(cpf: string) {
		try {
			const person = await personRepository.getAllPersons({
				params: { cpf: cpf.replace(/\D/g, '') },
			})
			form.setValues({
				...form.values,
				name: person[0].name,
				cpf: formatCPF(person[0].cpf),
				email: person[0].email ?? undefined,
				personId: person[0].id?.toString(),
			})
		} catch (error) {
			console.log(error)
			form.setFieldError('cpf', 'CPF é inválido ou a pessoa não existe.')
		}
	}

	function getSort(key: string) {
		const sortParameters = extractSort(selectSort.value as string)

		switch (sortParameters?.[key]) {
			case 'ASC': {
				return 'sort-up'
			}
			case 'DESC': {
				return 'sort-down'
			}
			default: {
				return 'sort'
			}
		}
	}

	function extractSort<T = string>(
		sort: string,
	):
		| {
				[x: string]: T
		  }
		| undefined {
		if (!sort) return

		const regexData = /^\[(\w+)\]\[(\w+)\]$/.exec(sort)

		if (!regexData) return

		return { [regexData[1]]: regexData[2] as T }
	}

	function handleSort(key: string) {
		const sortParameters = extractSort<keyof typeof changeValues>(
			selectSort.value as string,
		)
		const hasSearch = Object.hasOwn(sortParameters ?? {}, key)

		if (hasSearch && sortParameters) {
			const value = changeValues[sortParameters[key]]

			if (changeValues[value] !== changeValues.NONE) {
				selectSort.value = `[${key}][${value}]`

				return
			}

			selectSort.value = undefined

			return
		}

		selectSort.value = `[${key}][ASC]`
	}

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isManagersPlaceholderData.value) {
				page.value = to
			}
		}
	}

	function handleClear() {
		status.value = undefined
	}
</script>

<template>
	<div class="flex flex-col gap-y-4">
		<div class="mb-4 flex gap-10 items-center">
			<div class="flex gap-14 items-center justify-center">
				<titulo title="Lista de gestores" />

				<form-wrapper
					v-model="openCreateModal"
					:is-loading="isCreateManagerLoading"
					:title="`Cadastro Gestor`"
					class="sm:max-w-[526px]"
					@form-submit="onCreateSubmit"
				>
					<template #trigger>
						<tooltip-provider>
							<tooltip>
								<tooltip-trigger as-child>
									<button-root
										variant="ghost"
										size="icon"
										@click="openCreateModal = true"
									>
										<font-awesome-icon
											class="text-primary w-5 h-5"
											:icon="['fas', 'circle-plus']"
										/>
									</button-root>
								</tooltip-trigger>
								<tooltip-content side="right">
									<p>Cadastro Gestor</p>
								</tooltip-content>
							</tooltip>
						</tooltip-provider>
					</template>

					<template #fields>
						<manager-form
							:metadata="form.values"
							:disabled="isCreateManagerLoading"
							@search-cpf="handleSearchPerson"
							@on-close="openCreateModal = false"
						/>
					</template>
				</form-wrapper>
			</div>

			<div class="header_actions flex items-center gap-4 flex-1 justify-end">
				<select-root class="flex-[1]" v-model="status">
					<select-trigger class="lg:max-w-40 flex-[2]">
						<select-value class="text-left" placeholder="Status" />
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
							<button-root variant="ghost" size="icon" @click="handleClear">
								<font-awesome-icon
									class="text-primary w-5 h-5"
									:icon="['fas', 'eraser']"
								/>
							</button-root>
						</tooltip-trigger>
						<tooltip-content side="right">
							<p>Limpar pesquisa</p>
						</tooltip-content>
					</tooltip>
				</tooltip-provider>

				<tooltip-provider>
					<tooltip>
						<tooltip-trigger as-child>
							<button-root variant="ghost" size="icon" @click="handleClear">
								<font-awesome-icon
									class="text-primary w-5 h-5"
									:icon="['fas', 'print']"
								/>
							</button-root>
						</tooltip-trigger>
						<tooltip-content side="right">
							<p>Imprimir</p>
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
				:is-loading="isManagersLoading"
			/>

			<div :class="['flex w-full items-center justify-end px-4']">
				<table-pagination
					v-model="page"
					:disabled="formattedAllTypeOfManager.length <= 0"
					:total-itens="pageMetadata.totalItens"
					:items-per-page="perPage"
					@update-paginate="handlePagination"
				/>
			</div>
		</div>
	</div>
</template>
