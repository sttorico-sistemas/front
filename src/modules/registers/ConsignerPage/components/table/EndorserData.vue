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
	import { auxiliaryRepository, endorserRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { AddressModel, EndorserModel, ManagerModel } from '@/core/models'
	import {
		formatPhone,
		formatStatus,
		valueUpdater,
		type StatusFormatted,
	} from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import {
		EndorserUpdateAction,
		EndorserForm,
		EndorserDeleteAction,
	} from '@/modules/registers/ConsignerPage/components/table'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	type EndorserTable = {
		id: number
		name: string
		manager: string
		phone: string
		cellphone: string
		email: string
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
		data: endorsers,
		isLoading: isEndorsersLoading,
		isPlaceholderData: isEndorsersPlaceholderData,
	} = useQuery({
		queryKey: endorserRepository.getQueryKey(
			'endorsers',
			{
				page,
				limit: perPage,
			},
			status,
		),
		queryFn: ({ signal }) =>
			endorserRepository.getAllEndorsers({
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

	const {
		mutateAsync: handleDeleteEndorser,
		isPending: isDeleteEndorserLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			endorserRepository.activateEndorser({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: endorserRepository.getQueryKey(
					'endorsers',
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
					title: error.message ?? 'Erro ao atualizar status do averbador!',
				},
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Status do averbador apagado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleUpdateEndorser,
		isPending: isUpdateEndorserLoading,
	} = useMutation({
		mutationFn: (data: EndorserModel) =>
			endorserRepository.updateEndorser(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: endorserRepository.getQueryKey(
					'endorsers',
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
				{ title: error.message ?? `Erro ao atualizar o averbador!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Averbador atualizado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleCreateEndorser,
		isPending: isCreateEndorserLoading,
	} = useMutation({
		mutationFn: (data: EndorserModel) =>
			endorserRepository.createEndorser(data),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: endorserRepository.getQueryKey(
					'endorsers',
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
				{ title: error.message ?? `Erro ao criar o averbador!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Averbador criado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const formattedAllTypeOfEndorser = computed<EndorserTable[]>(() => {
		return (endorsers.value ?? []).map(
			({ id, name, cellphone, email, phone, manager, status }) => ({
				id: id as number,
				name,
				manager: manager.name,
				cellphone: formatPhone(cellphone),
				phone: formatPhone(phone),
				email,
				status: formatStatus(status as number),
			}),
		)
	})

	const columns: ColumnDef<EndorserTable>[] = [
		{
			accessorKey: 'name',
			meta: 'Nome',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfEndorser.value.length <= 0,
						onClick: () => handleSort('name'),
					},
					() => [
						'Nome',
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
			accessorKey: 'manager',
			meta: 'Gestor',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfEndorser.value.length <= 0,
						onClick: () => handleSort('city'),
					},
					() => [
						'Gestor',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('city')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('manager')),
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
						disabled: formattedAllTypeOfEndorser.value.length <= 0,
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
						disabled: formattedAllTypeOfEndorser.value.length <= 0,
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
						disabled: formattedAllTypeOfEndorser.value.length <= 0,
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
						disabled: formattedAllTypeOfEndorser.value.length <= 0,
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
						h(EndorserUpdateAction, {
							dataId: data.id,
							tableEndorserName: data.name,
							'onOn-edit': onUpdateSubmit,
							isLoading: isUpdateEndorserLoading.value,
							isActive: data.status.raw === 'ativo',
						}),
						h(EndorserDeleteAction, {
							dataId: data.id,
							tableEndorserName: data.name,
							'onOn-delete': onDeleteSubmit,
							isLoading: isDeleteEndorserLoading.value,
							isActive: data.status.raw === 'ativo',
						}),
					],
				)
			},
		},
	]

	const table = useVueTable({
		get data() {
			return formattedAllTypeOfEndorser.value
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
		name: z
			.string({ message: 'O nome é obrigatório' })
			.min(1, { message: 'O nome é obrigatório.' }),
		managerId: z
			.string({ message: 'O gestor é obrigatório' })
			.min(1, { message: 'O gestor é obrigatório.' }),
		endorserTypeId: z
			.string({ message: 'O tipo do averbador é obrigatório' })
			.min(1, { message: 'O tipo do averbador é obrigatório.' }),
		phone: z
			.string({ message: 'O telefone é obrigatório.' })
			.min(1, { message: 'O telefone é obrigatório.' }),
		cellphone: z
			.string({ message: 'O celular é obrigatório' })
			.min(1, { message: 'O celular é obrigatório.' }),
		email: z
			.string({ message: 'O e-mail é obrigatório' })
			.email({ message: 'O e-mail tem que ser válido.' })
			.min(1, { message: 'O e-mail é obrigatório.' }),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
	})

	const updateFormValue = (data: {
		phone: string
		cellphone: string
		email: string
	}) => {
		form.setValues(data)
	}

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreateEndorser(
			new EndorserModel({
				...values,
				manager: { id: +values.managerId } as ManagerModel,
				consigneeId: currentCode.value,
			}),
		).then(() => {
			openCreateModal.value = false
		})
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema>,
		onClose: () => void,
	) => {
		return handleUpdateEndorser(
			new EndorserModel({
				id,
				...values,
				manager: { id: +values.managerId } as ManagerModel,
				consigneeId: currentCode.value,
			}),
		).then(() => {
			onClose()
		})
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteEndorser({ id })
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
			if (!isEndorsersPlaceholderData.value) {
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
			<div class="flex gap-10 items-center justify-center">
				<titulo title="Lista de averbadores" />

				<form-wrapper
					v-model="openCreateModal"
					:is-loading="isCreateEndorserLoading"
					:title="`Cadastro Averbador`"
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
									<p>Cadastro Averbador</p>
								</tooltip-content>
							</tooltip>
						</tooltip-provider>
					</template>

					<template #fields>
						<endorser-form
							:metadata="form.values"
							:disabled="isCreateEndorserLoading"
							@on-close="openCreateModal = false"
							@set-values="updateFormValue"
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
				:is-loading="isEndorsersLoading"
			/>

			<div :class="['flex w-full items-center justify-end px-4']">
				<table-pagination
					v-model="page"
					:disabled="formattedAllTypeOfEndorser.length <= 0"
					:total-itens="pageMetadata.totalItens"
					:items-per-page="perPage"
					@update-paginate="handlePagination"
				/>
			</div>
		</div>
	</div>
</template>
