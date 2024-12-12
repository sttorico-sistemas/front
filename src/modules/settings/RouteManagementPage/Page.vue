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
	import { FormWrapper } from '@/core/components/form-wrapper'
	import {
		TableWrapper,
		TablePagination,
	} from '@/core/components/table-wrapper'
	import Breadcrumbs from 'src/core/components/Breadcrumbs.vue'
	import Titulo from 'src/core/components/Titulo.vue'
	import { generalRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { PageModel } from '@/core/models'
	import { valueUpdater } from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import {
		RouteManagerDeleteAction,
		RouteManagerForm,
		RouteManagerUpdateAction,
	} from './components/table'

	type RouteManagerTable = {
		id: number
		name: string
		slug: string
		url: string
	}

	// const changeValues = {
	// 	ASC: 'DESC',
	// 	DESC: 'NONE',
	// 	NONE: 'ASC',
	// } as const

	const openCreateModal = ref(false)
	const rowSelection = ref({})
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })
	const selectSort = useRouteQuery<string | undefined>('mtr-cgn-sort')
	const page = useRouteQuery('mtr-cgn-page', 1, { transform: Number })
	const perPage = useRouteQuery('mtr-cgn-per-page', 8, {
		transform: Number,
	})
	const queryClient = useQueryClient()
	const notify = useNotify()

	const {
		data: routeManagers,
		isLoading: isRouteManagersLoading,
		isPlaceholderData: isRouteManagersPlaceholderData,
	} = useQuery({
		queryKey: generalRepository.getQueryKey('route-managers', {
			page,
			limit: perPage,
		}),
		queryFn: ({ signal }) =>
			generalRepository.getAllPages({
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

	const {
		mutateAsync: handleDeleteRouteManager,
		isPending: isDeleteRouteManagerLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			generalRepository.deletePage({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: generalRepository.getQueryKey('route-managers', {
					page,
					limit: perPage,
				}),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: 'Erro ao apagar a página!' },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Página apagada com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleUpdateRouteManager,
		isPending: isUpdateRouteManagerLoading,
	} = useMutation({
		mutationFn: (data: PageModel) => generalRepository.updatePage(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: generalRepository.getQueryKey('route-managers', {
					page,
					limit: perPage,
				}),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: `Erro ao atualizar a página!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Página atualizada com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleCreateRouteManager,
		isPending: isCreateRouteManagerLoading,
	} = useMutation({
		mutationFn: (data: PageModel) => generalRepository.createPage(data),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: generalRepository.getQueryKey('route-managers', {
					page,
					limit: perPage,
				}),
			})
			openCreateModal.value = false
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: `Erro ao criar a página!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Página criada com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const formattedAllPages = computed<RouteManagerTable[]>(() => {
		return (routeManagers.value ?? []).map(({ id, name, slug, url }) => ({
			id: id as number,
			name,
			slug,
			url,
		}))
	})

	const columns: ColumnDef<RouteManagerTable>[] = [
		{
			accessorKey: 'name',
			meta: 'Nome',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllPages.value.length <= 0,
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
			accessorKey: 'slug',
			meta: 'Slug',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllPages.value.length <= 0,
						// onClick: () => handleSort('slug'),
					},
					() => [
						'Slug',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('slug')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('slug')),
			enableHiding: false,
		},
		{
			accessorKey: 'url',
			meta: 'URL',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllPages.value.length <= 0,
						// onClick: () => handleSort('slug'),
					},
					() => [
						'URL',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('slug')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('url')),
			enableHiding: false,
		},
		{
			id: 'actions',
			header: 'Ações',
			cell: ({ row }) => {
				const data = row.original
				return h('div', { class: 'relative max-w-4 flex gap-2' }, [
					h(RouteManagerUpdateAction, {
						dataId: data.id,
						tableRouteManagerName: data.name,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdateRouteManagerLoading.value,
					}),
					h(RouteManagerDeleteAction, {
						dataId: data.id,
						tableRouteManagerName: data.name,
						'onOn-delete': onDeleteSubmit,
						isLoading: isDeleteRouteManagerLoading.value,
						isActive: true,
					}),
				])
			},
		},
	]

	const table = useVueTable({
		get data() {
			return formattedAllPages.value
		},
		get columns() {
			return columns
		},
		getCoreRowModel: getCoreRowModel(),
		manualSorting: true,
		manualPagination: true,
		// rowCount: pageMetadata.value.totalItens,
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
			.string({ message: 'O nome é obrigatório.' })
			.min(1, { message: 'O nome é obrigatório.' }),
		slug: z
			.string({ message: 'O slug é obrigatório.' })
			.min(1, { message: 'O slug é obrigatório.' }),
		url: z
			.string({ message: 'A url é obrigatória.' })
			.min(1, { message: 'A url é obrigatória.' }),
		permissions: z
			.object(
				{
					id: z.string({ message: 'Esse campo é obrigatório.' }),
					title: z.string({ message: 'Esse campo é obrigatório.' }),
				},
				{ message: 'Esse campo é obrigatório.' },
			)
			.optional(),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
	})

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreateRouteManager(
			new PageModel({
				...values,
				parentId: values?.permissions?.id,
				children: [],
			}),
		)
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema>,
		onClose: () => void,
	) => {
		return handleUpdateRouteManager(
			new PageModel({
				...values,
				id: `${id}`,
				parentId: values?.permissions?.id,
				children: [],
			}),
		).then(() => {
			onClose()
		})
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteRouteManager({ id })
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
	// 			selectRouteManagersRefetch()
	// 			return
	// 		}

	// 		selectSort.value = undefined
	// 		selectRouteManagersRefetch()
	// 		return
	// 	}

	// 	selectSort.value = `[${key}][ASC]`
	// 	selectRouteManagersRefetch()
	// }

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isRouteManagersPlaceholderData.value) {
				page.value = to
			}
		}
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Configurações', 'Páginas']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex gap-10 items-center justify-center">
					<titulo title="Gerenciar páginas" />

					<form-wrapper
						v-model="openCreateModal"
						:is-loading="isCreateRouteManagerLoading"
						:title="`Criar uma nova página`"
						description="Crie o conteúdo de uma nova página."
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
										<p>Cadastre um nova páginas</p>
									</tooltip-content>
								</tooltip>
							</tooltip-provider>
						</template>

						<template #fields>
							<route-manager-form
								:metadata="form.values"
								:disabled="isCreateRouteManagerLoading"
							/>
						</template>
					</form-wrapper>
				</div>
			</div>

			<div class="pb-1">
				<table-wrapper
					:table="table"
					:column-size="columns.length"
					:row-limit="formattedAllPages.length"
					:is-loading="isRouteManagersLoading"
				/>

				<div :class="['flex w-full items-center px-4']">
					<table-pagination
						v-model="page"
						:disabled="formattedAllPages.length <= 0"
						:total-itens="pageMetadata.totalItens"
						:items-per-page="perPage"
						@update-paginate="handlePagination"
					/>
				</div>
			</div>
		</div>
	</main>
</template>
