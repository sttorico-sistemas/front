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
	import { auxiliaryRepository, backOfficeRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { AddressModel, BackOfficeModel } from '@/core/models'
	import {
		formatPhone,
		formatStatus,
		valueUpdater,
		type StatusFormatted,
	} from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import {
		BackOfficeUpdateAction,
		BackOfficeForm,
		BackOfficeDeleteAction,
	} from '@/modules/registers/ConsignerAdminPage/components/table'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	type BackOfficeTable = {
		id: number
		name: string
		sector: string
		city: string
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
		data: backOffices,
		isLoading: isBackOfficesLoading,
		isPlaceholderData: isBackOfficesPlaceholderData,
	} = useQuery({
		queryKey: backOfficeRepository.getQueryKey(
			'back-office',
			{
				page,
				limit: perPage,
			},
			status,
			currentCode,
		),
		queryFn: ({ signal }) =>
			backOfficeRepository.getAllBackOffices({
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
		mutateAsync: handleDeleteBackOffice,
		isPending: isDeleteBackOfficeLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			backOfficeRepository.activateBackOffice({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: backOfficeRepository.getQueryKey(
					'back-office',
					{
						page,
						limit: perPage,
					},
					status,
					currentCode,
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{
					title: error.message ?? 'Erro ao atualizar status do normativo!',
				},
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Status do normativo apagado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleUpdateBackOffice,
		isPending: isUpdateBackOfficeLoading,
	} = useMutation({
		mutationFn: (data: BackOfficeModel) =>
			backOfficeRepository.updateBackOffice(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: backOfficeRepository.getQueryKey(
					'back-office',
					{
						page,
						limit: perPage,
					},
					status,
					currentCode,
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: error.message ?? `Erro ao atualizar o normativo!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Normativo atualizado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleCreateBackOffice,
		isPending: isCreateBackOfficeLoading,
	} = useMutation({
		mutationFn: (data: BackOfficeModel) =>
			backOfficeRepository.createBackOffice(data),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: backOfficeRepository.getQueryKey(
					'back-office',
					{
						page,
						limit: perPage,
					},
					status,
					currentCode,
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: error.message ?? `Erro ao criar o normativo!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Normativo criado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const formattedAllBackOffice = computed<BackOfficeTable[]>(() => {
		return (backOffices.value ?? []).map(
			({ id, name, sectorName, cityName, status }) => ({
				id: id as number,
				name,
				sector: sectorName as string,
				city: cityName as string,
				status: formatStatus(status as number),
			}),
		)
	})

	const columns: ColumnDef<BackOfficeTable>[] = [
		{
			accessorKey: 'id',
			meta: 'Código',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllBackOffice.value.length <= 0,
						onClick: () => handleSort('id'),
					},
					() => [
						'Código',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('id')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('id')),
			enableHiding: false,
		},
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
						disabled: formattedAllBackOffice.value.length <= 0,
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
			accessorKey: 'sector',
			meta: 'Setor',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllBackOffice.value.length <= 0,
						onClick: () => handleSort('sector'),
					},
					() => [
						'Setor',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('sector')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('sector')),
			enableHiding: false,
		},
		{
			accessorKey: 'city',
			meta: 'Cidade',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllBackOffice.value.length <= 0,
						onClick: () => handleSort('city'),
					},
					() => [
						'Cidade',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('city')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('city')),
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
						disabled: formattedAllBackOffice.value.length <= 0,
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
						h(BackOfficeUpdateAction, {
							dataId: data.id,
							tableBackOfficeName: data.name,
							'onOn-edit': onUpdateSubmit,
							isLoading: isUpdateBackOfficeLoading.value,
							isActive: data.status.raw === 1,
						}),
						h(BackOfficeDeleteAction, {
							dataId: data.id,
							tableBackOfficeName: data.name,
							'onOn-delete': onDeleteSubmit,
							isLoading: isDeleteBackOfficeLoading.value,
							isActive: data.status.raw === 1,
						}),
					],
				)
			},
		},
	]

	const table = useVueTable({
		get data() {
			return formattedAllBackOffice.value
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

	const onCreateSubmit = form.handleSubmit(async (values) => {
		// return handleCreateBackOffice(
		// 	// new BackOfficeModel({  }),
		// ).then(() => {
		// 	openCreateModal.value = false
		// })
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema> & { addressId: number },
		onClose: () => void,
	) => {
		// return handleUpdateBackOffice(
		// 	new BackOfficeModel({
		// 		id,
		// 		...values,
		// 	}),
		// ).then(() => {
		// 	onClose()
		// })
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteBackOffice({ id })
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
			if (!isBackOfficesPlaceholderData.value) {
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
				<titulo title="Back Offices Cadastrados" />

				<form-wrapper
					v-model="openCreateModal"
					:is-loading="isCreateBackOfficeLoading"
					:title="`Cadastro Back Office`"
					class="sm:max-w-[780px]"
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
										disabled
									>
										<font-awesome-icon
											class="text-primary w-5 h-5"
											:icon="['fas', 'circle-plus']"
										/>
									</button-root>
								</tooltip-trigger>
								<tooltip-content side="right">
									<p>Cadastro Back Office</p>
								</tooltip-content>
							</tooltip>
						</tooltip-provider>
					</template>

					<template #fields>
						<back-office-form
							:metadata="form.values"
							:disabled="isCreateBackOfficeLoading"
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
				:is-loading="isBackOfficesLoading"
			/>

			<div :class="['flex w-full items-center justify-end px-4']">
				<table-pagination
					v-model="page"
					:disabled="formattedAllBackOffice.length <= 0"
					:total-itens="pageMetadata.totalItens"
					:items-per-page="perPage"
					@update-paginate="handlePagination"
				/>
			</div>
		</div>
	</div>
</template>
