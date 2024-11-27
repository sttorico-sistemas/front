<script lang="ts" setup>
	import { ref, computed, h } from 'vue'
	import * as z from 'zod'

	import Titulo from 'src/core/components/Titulo.vue'
	import Breadcrumbs from 'src/core/components/Breadcrumbs.vue'

	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger,
	} from '@/core/components/tooltip'
	import { FormWrapper } from '@/core/components/form-wrapper'
	import { TableWrapper } from '@/core/components/table-wrapper'

	import { useNotify } from '@/core/composables'
	import { generalRepository } from '@/core/stores'
	import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
	import { PageModel } from '@/core/models'
	import { ColumnDef, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { valueUpdater } from '@/core/utils'
	import { useForm } from 'vee-validate'
	import { toTypedSchema } from '@vee-validate/zod'
	import { EditTablePage, TablePageForm } from './components/page-table'

	type PagesTable = {
		id: number
		name: string
		slug: string
		url: string
	}

	const changeValues = {
		ASC: 'DESC',
		DESC: 'NONE',
		NONE: 'ASC',
	} as const

	const openCreateModal = ref(false)
	const rowSelection = ref({})

	const { data: allPages, isLoading: isAllPagesLoading } = useQuery({
		queryKey: generalRepository.getQueryKey('all-pages'),
		queryFn: ({ signal }) => generalRepository.getAllPages({ signal }),
	})

	const queryClient = useQueryClient()
	const notify = useNotify()

	const { mutateAsync: handleUpdatePage, isPending: isUpdatePageLoading } =
		useMutation({
			mutationFn: (
				data: Pick<PageModel, 'name' | 'slug' | 'url' | 'parentId' | 'id'>,
			) => generalRepository.updateTableValue(data),
			onSettled: async () => {
				await queryClient.invalidateQueries({
					queryKey: generalRepository.getQueryKey('pages'),
				})
				return await queryClient.invalidateQueries({
					queryKey: generalRepository.getQueryKey('all-pages'),
				})
			},
			onError: (error, variables, context) => {
				notify.error(
					error,
					{
						title: 'Erro ao atualizar página!',
					},
					{ duration: 1500 },
				)
			},
			onSuccess: (data, variables, context) => {
				notify.success(
					{
						title: `Página atualizada com sucesso!`,
					},
					{ duration: 1500 },
				)
			},
		})

	const { mutateAsync: handleCreatePage, isPending: isCreatePageLoading } =
		useMutation({
			mutationFn: (
				data: Pick<PageModel, 'name' | 'slug' | 'url' | 'parentId'>,
			) => generalRepository.createPage(data),
			onSettled: async () => {
				await queryClient.invalidateQueries({
					queryKey: generalRepository.getQueryKey('all-pages'),
				})
				await queryClient.invalidateQueries({
					queryKey: generalRepository.getQueryKey('pages'),
				})
				openCreateModal.value = false
			},
			onError: (error, variables, context) => {
				notify.error(
					error,
					{
						title: 'Erro ao cadastrar página!',
					},
					{ duration: 1500 },
				)
			},
			onSuccess: (data, variables, context) => {
				notify.success(
					{
						title: `Página cadastrada com sucesso!`,
					},
					{ duration: 1500 },
				)
			},
		})

	const formattedAllPages = computed(() => {
		return (allPages.value ?? []).map(({ id, name, slug, url }) => ({
			id,
			name,
			slug,
			url,
		}))
	})

	const columns: ColumnDef<PagesTable>[] = [
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
						// onClick: () => handleSort('id'),
					},
					() => [
						'Nome',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('id')],
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
			header: 'Ação',
			cell: ({ row }) => {
				const data = row.original
				return h('div', { class: 'relative max-w-4 flex gap-2' }, [
					h(EditTablePage, {
						dataId: data.id,
						tablePageName: data.name,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdatePageLoading.value,
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
		name: z.string({ message: 'Esse campo é obrigatório.' }),
		slug: z.string({ message: 'Esse campo é obrigatório.' }),
		url: z.string({ message: 'Esse campo é obrigatório.' }),
		parentId: z
			.string({ message: 'Esse campo é obrigatório.' })
			.optional()
			.nullable(),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
	})

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreatePage({
			...values,
			parentId: values.parentId ? +values.parentId : undefined,
		}).then((response) => {
			openCreateModal.value = false
			return response
		})
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema>,
		onClose: () => void,
	) => {
		return handleUpdatePage({
			id,
			...values,
			parentId: values.parentId ? +values.parentId : undefined,
		}).then(() => {
			onClose()
		})
	}
</script>

<template>
	<main>
		<breadcrumbs :paginas="['Configurações', 'Páginas']" />

		<div class="panel mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex gap-10 items-center justify-center">
					<titulo title="Páginas" />

					<form-wrapper
						v-model="openCreateModal"
						:is-loading="isCreatePageLoading"
						:title="`Criar nova página`"
						description="Crie o conteúdo da nova página."
						class="sm:max-w-[780px]"
						@form-submit="onCreateSubmit"
					>
						<template #trigger>
							<tooltip-provider>
								<tooltip>
									<tooltip-trigger as-child>
										<button-root
											variant="ghost"
											@click="openCreateModal = true"
										>
											<font-awesome-icon
												class="text-primary_3-table w-5 h-5"
												:icon="['fas', 'circle-plus']"
											/>
										</button-root>
									</tooltip-trigger>
									<tooltip-content side="right">
										<p>Cadastre um nova página</p>
									</tooltip-content>
								</tooltip>
							</tooltip-provider>
						</template>

						<template #fields>
							<TablePageForm
								:metadata="form.values"
								:disabled="isCreatePageLoading"
							/>
						</template>
					</form-wrapper>
				</div>
			</div>

			<div class="datatable pb-1">
				<table-wrapper
					:table="table"
					:column-size="columns.length"
					:row-limit="formattedAllPages.length"
					:is-loading="isAllPagesLoading"
				/>
			</div>
		</div>
	</main>
</template>
