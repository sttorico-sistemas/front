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
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger,
	} from '@/core/components/tooltip'
	import {
		SelectRoot,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger,
		SelectValue,
	} from '@/core/components/fields/select'
	import { InputRoot } from '@/core/components/fields/input'
	import { FormWrapper } from '@/core/components/form-wrapper'
	import {
		TableWrapper,
		TablePagination,
	} from '@/core/components/table-wrapper'
	import Breadcrumbs from '@/core/components/Breadcrumbs.vue'
	import Titulo from '@/core/components/Titulo.vue'
	import { masterConsignerRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { MasterConsignerModel } from '@/core/models'
	import { debounceAsync, valueUpdater } from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import {
		MasterConsignerDeleteAction,
		MasterConsignerForm,
		MasterConsignerUpdateAction,
	} from './components/table'
	import { Status } from '@/core/types'

	type MasterConsignerTable = {
		id: number
		name: string
		status: Status
	}

	// const changeValues = {
	// 	ASC: 'DESC',
	// 	DESC: 'NONE',
	// 	NONE: 'ASC',
	// } as const

	const statusItems = [
		{ value: 1, label: 'Ativado' },
		{ value: 0, label: 'Desativado' },
	] as const

	const openCreateModal = ref(false)
	const rowSelection = ref({})
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })
	// const selectSort = useRouteQuery<string | undefined>('mtr-cgn-sort')
	const selectSearch = useRouteQuery<string | undefined>(
		'mtr-cgn-search',
		undefined,
	)
	const search = ref<string | undefined>()
	const status = useRouteQuery<string | undefined>('mtr-cgn-status', undefined)
	const page = useRouteQuery('mtr-cgn-page', 1, { transform: Number })
	const perPage = useRouteQuery('mtr-cgn-per-page', 8, {
		transform: Number,
	})
	const queryClient = useQueryClient()
	const notify = useNotify()

	const {
		data: masterConsigners,
		isLoading: isMasterConsignersLoading,
		isPlaceholderData: isMasterConsignersPlaceholderData,
	} = useQuery({
		queryKey: masterConsignerRepository.getQueryKey(
			'master-consigners',
			{
				page,
				limit: perPage,
			},
			selectSearch,
			status,
		),
		queryFn: ({ signal }) =>
			masterConsignerRepository.getAllMasterConsigners({
				signal,
				params: {
					page: page.value,
					per_page: perPage.value,
					search: selectSearch.value,
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
		mutateAsync: handleActivateMasterConsigner,
		isPending: isActivateMasterConsignerLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			masterConsignerRepository.activateMasterConsigner({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: masterConsignerRepository.getQueryKey(
					'master-consigners',
					{
						page,
						limit: perPage,
					},
					selectSearch,
					status,
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: 'Erro ao atualizar status do consignante master!' },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Status do consignante master alterado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleUpdateMasterConsigner,
		isPending: isUpdateMasterConsignerLoading,
	} = useMutation({
		mutationFn: (data: MasterConsignerModel) =>
			masterConsignerRepository.updateMasterConsigner(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: masterConsignerRepository.getQueryKey(
					'master-consigners',
					{
						page,
						limit: perPage,
					},
					selectSearch,
					status,
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: `Erro ao atualizar o consignante master!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Consignante master atualizado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleCreateMasterConsigner,
		isPending: isCreateMasterConsignerLoading,
	} = useMutation({
		mutationFn: (data: MasterConsignerModel) =>
			masterConsignerRepository.createMasterConsigner(data),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: masterConsignerRepository.getQueryKey(
					'master-consigners',
					{
						page,
						limit: perPage,
					},
					selectSearch,
					status,
				),
			})
			openCreateModal.value = false
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: `Erro ao criar 0 consignante master!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Consignante master criado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const formattedAllTypeOfMasterConsigner = computed<MasterConsignerTable[]>(
		() => {
			return (masterConsigners.value ?? []).map(({ id, name, status }) => ({
				id: id as number,
				name,
				status: status as Status,
			}))
		},
	)

	const columns: ColumnDef<MasterConsignerTable>[] = [
		{
			accessorKey: 'id',
			meta: 'Código',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfMasterConsigner.value.length <= 0,
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
			meta: 'Nome',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfMasterConsigner.value.length <= 0,
						// onClick: () => handleSort('name'),
					},
					() => [
						'Nome',
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
			id: 'actions',
			header: 'Ações',
			cell: ({ row }) => {
				const data = row.original
				return h('div', { class: 'relative max-w-4 flex gap-2' }, [
					h(MasterConsignerUpdateAction, {
						dataId: data.id,
						tableMasterConsignerName: data.name,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdateMasterConsignerLoading.value,
						isActive: data.status.value === 1,
					}),
					h(MasterConsignerDeleteAction, {
						dataId: data.id,
						tableMasterConsignerName: data.name,
						'onOn-delete': onDeleteSubmit,
						isLoading: isActivateMasterConsignerLoading.value,
						isActive: data.status.value === 1,
					}),
				])
			},
		},
	]

	const table = useVueTable({
		get data() {
			return formattedAllTypeOfMasterConsigner.value
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
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
	})

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreateMasterConsigner(new MasterConsignerModel(values))
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema>,
		onClose: () => void,
	) => {
		return handleUpdateMasterConsigner(
			new MasterConsignerModel({
				id,
				...values,
			}),
		).then(() => {
			onClose()
		})
	}

	const onDeleteSubmit = async (id: number) => {
		return handleActivateMasterConsigner({ id })
	}

	const handleSearch = debounceAsync(async (value: string | number) => {
		selectSearch.value = value.toString()
	}, 500)

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
	// 			selectMasterConsignersRefetch()
	// 			return
	// 		}

	// 		selectSort.value = undefined
	// 		selectMasterConsignersRefetch()
	// 		return
	// 	}

	// 	selectSort.value = `[${key}][ASC]`
	// 	selectMasterConsignersRefetch()
	// }

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isMasterConsignersPlaceholderData.value) {
				page.value = to
			}
		}
	}

	function handleClear() {
		selectSearch.value = undefined
		search.value = undefined
		status.value = undefined
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Cadastro', 'Consignante master']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div
					class="flex flex-1 gap-10 items-center justify-between md:justify-start md:flex-initial"
				>
					<titulo title="Gerenciar consignante master" />

					<form-wrapper
						v-model="openCreateModal"
						:is-loading="isCreateMasterConsignerLoading"
						:title="`Criar um novo consignante master`"
						description="Crie o conteúdo de um novo consignante master."
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
										<p>Cadastre um novo consignante master</p>
									</tooltip-content>
								</tooltip>
							</tooltip-provider>
						</template>

						<template #fields>
							<master-consigner-form
								:metadata="form.values"
								:disabled="isCreateMasterConsignerLoading"
							/>
						</template>
					</form-wrapper>
				</div>

				<div class="header_actions flex items-center gap-4 flex-1 justify-end">
					<select-root class="flex-[1]" v-model="status">
						<select-trigger class="lg:max-w-96 flex-[2]">
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

					<input-root
						class="flex-[3] max-w-96"
						placeholder="Search"
						v-model="search"
						@update:model-value="handleSearch"
					/>

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
					:is-loading="isMasterConsignersLoading"
				/>

				<div :class="['flex w-full items-center px-4']">
					<table-pagination
						v-model="page"
						:disabled="formattedAllTypeOfMasterConsigner.length <= 0"
						:total-itens="pageMetadata.totalItens"
						:items-per-page="perPage"
						@update-paginate="handlePagination"
					/>
				</div>
			</div>
		</div>
	</main>
</template>
