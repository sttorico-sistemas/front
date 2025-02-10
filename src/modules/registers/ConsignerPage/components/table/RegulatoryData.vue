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
	import { auxiliaryRepository, regulatoryRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { AddressModel, RegulatoryModel } from '@/core/models'
	import {
		formatPhone,
		formatStatus,
		valueUpdater,
		type StatusFormatted,
	} from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import {
		RegulatoryUpdateAction,
		RegulatoryForm,
		RegulatoryDeleteAction,
	} from '@/modules/registers/ConsignerPage/components/table'

	type RegulatoryTable = {
		id: number
		type: string
		number: string
		target: string
		publicationAt: string
		revocationAt: string
		status: StatusFormatted
	}

	const statusItems = [
		{ value: 1, label: 'Ativado' },
		{ value: 0, label: 'Desativado' },
	] as const

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
		data: regulations,
		isLoading: isRegulationsLoading,
		isPlaceholderData: isRegulationsPlaceholderData,
	} = useQuery({
		queryKey: regulatoryRepository.getQueryKey(
			'regulations',
			{
				page,
				limit: perPage,
			},
			status,
		),
		queryFn: ({ signal }) =>
			regulatoryRepository.getAllRegulations({
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
		mutateAsync: handleDeleteRegulatory,
		isPending: isDeleteRegulatoryLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			regulatoryRepository.activateRegulatory({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: regulatoryRepository.getQueryKey(
					'regulations',
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
		mutateAsync: handleUpdateRegulatory,
		isPending: isUpdateRegulatoryLoading,
	} = useMutation({
		mutationFn: (data: RegulatoryModel) =>
			regulatoryRepository.updateRegulatory(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: regulatoryRepository.getQueryKey(
					'regulations',
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
		mutateAsync: handleCreateRegulatory,
		isPending: isCreateRegulatoryLoading,
	} = useMutation({
		mutationFn: (data: RegulatoryModel) =>
			regulatoryRepository.createRegulatory(data),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: regulatoryRepository.getQueryKey(
					'regulations',
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

	const formattedAllTypeOfRegulatory = computed<RegulatoryTable[]>(() => {
		return (regulations.value ?? []).map(
			({ id, number, target, typeName, publicationAt, revocationAt, status }) => ({
				id: id as number,
				number,
				target,
				type: typeName as string,
				publicationAt: Intl.DateTimeFormat('pt-BR').format(new Date(publicationAt)),
				revocationAt: Intl.DateTimeFormat('pt-BR').format(new Date(revocationAt)),
				status: formatStatus(status as string),
			}),
		)
	})

	const columns: ColumnDef<RegulatoryTable>[] = [
		{
			accessorKey: 'id',
			meta: 'Código',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfRegulatory.value.length <= 0,
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
			accessorKey: 'type',
			meta: 'Tipo',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfRegulatory.value.length <= 0,
						// onClick: () => handleSort('type'),
					},
					() => [
						'Tipo',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('type')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('type')),
			enableHiding: false,
		},
		{
			accessorKey: 'number',
			meta: 'Número',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfRegulatory.value.length <= 0,
						// onClick: () => handleSort('number'),
					},
					() => [
						'Número',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('number')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('number')),
			enableHiding: false,
		},
		{
			accessorKey: 'target',
			meta: 'Objeto',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfRegulatory.value.length <= 0,
						// onClick: () => handleSort('target'),
					},
					() => [
						'Objeto',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('target')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('target')),
			enableHiding: false,
		},
		{
			accessorKey: 'publicationAt',
			meta: 'Data Publicação',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfRegulatory.value.length <= 0,
						// onClick: () => handleSort('publicationAt'),
					},
					() => [
						'Data Publicação',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('publicationAt')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('publicationAt')),
			enableHiding: false,
		},
		{
			accessorKey: 'revocationAt',
			meta: 'Data de Revogação',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfRegulatory.value.length <= 0,
						// onClick: () => handleSort('revocationAt'),
					},
					() => [
						'Data de Revogação',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('revocationAt')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('revocationAt')),
			enableHiding: false,
		},
		{
			accessorKey: 'status',
			meta: 'Status',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: ['w-full justify-start px-1 font-bold'],
						disabled: formattedAllTypeOfRegulatory.value.length <= 0,
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
					h(RegulatoryUpdateAction, {
						dataId: data.id,
						tableRegulatoryName: data.target,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdateRegulatoryLoading.value,
						isActive: data.status.raw === 'ativo',
					}),
					h(RegulatoryDeleteAction, {
						dataId: data.id,
						tableRegulatoryName: data.target,
						'onOn-delete': onDeleteSubmit,
						isLoading: isDeleteRegulatoryLoading.value,
						isActive: data.status.raw === 'ativo',
					}),
				])
			},
		},
	]

	const table = useVueTable({
		get data() {
			return formattedAllTypeOfRegulatory.value
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
		// return handleCreateRegulatory(
		// 	// new RegulatoryModel({  }),
		// ).then(() => {
		// 	openCreateModal.value = false
		// })
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema> & { addressId: number },
		onClose: () => void,
	) => {
		// return handleUpdateRegulatory(
		// 	new RegulatoryModel({
		// 		id,
		// 		...values,
		// 	}),
		// ).then(() => {
		// 	onClose()
		// })
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteRegulatory({ id })
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
	// 			selectRegulationsRefetch()
	// 			return
	// 		}

	// 		selectSort.value = undefined
	// 		selectRegulationsRefetch()
	// 		return
	// 	}

	// 	selectSort.value = `[${key}][ASC]`
	// 	selectRegulationsRefetch()
	// }

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isRegulationsPlaceholderData.value) {
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
				<titulo title="Lista de normativos" />

				<form-wrapper
					v-model="openCreateModal"
					:is-loading="isCreateRegulatoryLoading"
					:title="`Criar um novo normativo`"
					description="Crie o conteúdo de um novo normativo."
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
										disabled
									>
										<font-awesome-icon
											class="text-primary w-5 h-5"
											:icon="['fas', 'circle-plus']"
										/>
									</button-root>
								</tooltip-trigger>
								<tooltip-content side="right">
									<p>Cadastre um novo normativo</p>
								</tooltip-content>
							</tooltip>
						</tooltip-provider>
					</template>

					<template #fields>
						<regulatory-form
							:metadata="form.values"
							:disabled="isCreateRegulatoryLoading"
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
									class="text-primary w-5 h-5"
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
				:is-loading="isRegulationsLoading"
			/>

			<div :class="['flex w-full items-center px-4']">
				<table-pagination
					v-model="page"
					:disabled="formattedAllTypeOfRegulatory.length <= 0"
					:total-itens="pageMetadata.totalItens"
					:items-per-page="perPage"
					@update-paginate="handlePagination"
				/>
			</div>
		</div>
	</div>
</template>
