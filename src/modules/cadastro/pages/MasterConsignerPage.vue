<script lang="ts" setup>
	import { computed, h, ref } from 'vue'
	import * as z from 'zod'
	import Breadcrumbs from 'src/core/components/Breadcrumbs.vue'
	import Titulo from 'src/core/components/Titulo.vue'
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger,
	} from '@/core/components/tooltip'
	import { FormWrapper } from '@/core/components/form-wrapper'
	import { TableWrapper } from '@/core/components/table-wrapper'
	import {
		keepPreviousData,
		useMutation,
		useQuery,
		useQueryClient,
	} from '@tanstack/vue-query'
	import { masterConsignerRepository } from '@/core/stores'
	import { useRouteQuery } from '@vueuse/router'
	import { useNotify } from '@/core/composables'
	import { MasterConsignerModel } from '@/core/models'
	import { valueUpdater } from '@/core/utils'
	import { ColumnDef, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
	import { ButtonRoot } from '@/core/components/button'
	import { useForm } from 'vee-validate'
	import { toTypedSchema } from '@vee-validate/zod'
	import {
		MasterConsignerDeleteAction,
		MasterConsignerForm,
		MasterConsignerUpdateAction,
	} from '../../cadastro/pages/components/master-consigner-table'
	import TablePagination from '@/core/components/table-wrapper/TablePagination.vue'

	type MasterConsignerTable = {
		id: number
		name: string
	}

	const changeValues = {
		ASC: 'DESC',
		DESC: 'NONE',
		NONE: 'ASC',
	} as const

	const openCreateModal = ref(false)
	const rowSelection = ref({})
	const page = useRouteQuery('master-consigner-page', 1, { transform: Number })
	const perPage = useRouteQuery('master-consigner-per-page', 8, { transform: Number })
	const selectSort = useRouteQuery<string | undefined>('master-consigner-sort')
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })

	const {
		data: masterConsigners,
		isLoading: isMasterConsignersLoading,
		refetch: selectMasterConsignersRefetch,
		isPlaceholderData: isMasterConsignersPlaceholderData,
	} = useQuery({
		queryKey: masterConsignerRepository.getQueryKey('master-consigners', {
			page,
			limit: perPage,
		}),
		queryFn: ({ signal }) =>
			masterConsignerRepository.getAllMasterConsigners({
				signal,
				params: { page: page.value, per_page: perPage.value },
				metaCallback: (meta) => {
					pageMetadata.value = {
						totalItens: meta.total,
						totalPages: meta.last_page,
					}
				},
			}),
		placeholderData: keepPreviousData,
	})

	const queryClient = useQueryClient()
	const notify = useNotify()

	const {
		mutateAsync: handleDeleteMasterConsigner,
		isPending: isDeleteMasterConsignerLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			masterConsignerRepository.deleteMasterConsigner({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: masterConsignerRepository.getQueryKey('master-consigners', {
					page,
					limit: perPage,
				}),
			})
		},
		onError: (error, variables, context) => {
			notify.error(
				error,
				{ title: 'Erro ao apagar o consignante master!' },
				{ duration: 1500 },
			)
		},
		onSuccess: (data, variables, context) => {
			notify.success(
				{ title: `Consignante master apagado com sucesso!` },
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
				queryKey: masterConsignerRepository.getQueryKey('master-consigners', {
					page,
					limit: perPage,
				}),
			})
		},
		onError: (error, variables, context) => {
			notify.success(
				{ title: `Erro ao atualizar o consignante master!` },
				{ duration: 1500 },
			)
		},
		onSuccess: (data, variables, context) => {
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
				queryKey: masterConsignerRepository.getQueryKey('master-consigners', {
					page,
					limit: perPage,
				}),
			})
			openCreateModal.value = false
		},
		onError: (error, variables, context) => {
			notify.success(
				{ title: `Erro ao criar a consignante master!` },
				{ duration: 1500 },
			)
		},
		onSuccess: (data, variables, context) => {
			notify.success(
				{ title: `Consignante criado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const formattedAllTypeOfMasterConsigner = computed<MasterConsignerTable[]>(
		() => {
			return (masterConsigners.value ?? []).map(({ id, name }) => ({
				id: id as number,
				name,
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
			header: 'Ação',
			cell: ({ row }) => {
				const data = row.original
				return h('div', { class: 'relative max-w-4 flex gap-2' }, [
					h(MasterConsignerUpdateAction, {
						dataId: data.id,
						tableMasterConsignerName: data.name,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdateMasterConsignerLoading.value,
					}),
					h(MasterConsignerDeleteAction, {
						dataId: data.id,
						tableMasterConsignerName: data.name,
						'onOn-delete': onDeleteSubmit,
						isLoading: isDeleteMasterConsignerLoading.value,
						isActive: true,
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
		name: z.string({ message: 'Esse campo é obrigatório.' }),
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
	) => {
		return handleUpdateMasterConsigner(
			new MasterConsignerModel({
				id,
				...values,
			}),
		)
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteMasterConsigner({ id })
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
				selectMasterConsignersRefetch()
				return
			}

			selectSort.value = undefined
			selectMasterConsignersRefetch()
			return
		}

		selectSort.value = `[${key}][ASC]`
		selectMasterConsignersRefetch()
	}

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isMasterConsignersPlaceholderData.value) {
				page.value = to
			}
		}
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Consignante master']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex gap-10 items-center justify-center">
					<Titulo title="Gerenciar consignante master" />

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
												class="text-primary w-5 h-5"
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
							<MasterConsignerForm
								:metadata="form.values"
								:disabled="isCreateMasterConsignerLoading"
							/>
						</template>
					</form-wrapper>
				</div>
			</div>

			<div class="datatable pb-1">
				<table-wrapper
					:table="table"
					:column-size="columns.length"
					:row-limit="perPage"
					:is-loading="isMasterConsignersLoading"
				/>

				<div :class="['flex w-full items-center px-4']">
					<div class="flex-1 text-sm text-muted-foreground">
						<!-- {{ formattedAllTypeTable.length }} de {{ pageMetadata.totalItens }} linha(s)
					selecionadas. -->
					</div>

					<TablePagination
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

<style lang="scss" scoped>
	.header_actions:deep(.custom-multiselect) {
		.multiselect__placeholder {
			font-size: 0.75rem;
			line-height: 1rem;
			font-weight: 600;
			white-space: nowrap;
			color: rgb(14 23 38);
		}

		.multiselect__option {
			font-size: 0.75rem;
			line-height: 1rem;
			white-space: normal;
		}
	}
</style>
