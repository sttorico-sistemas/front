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
		FileManagerDeleteAction,
		FileManagerForm,
		FileManagerUpdateAction,
	} from './components/table'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Checkbox from '@/core/components/fields/checkbox/Checkbox.vue'

	type FileManagerTable = {
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
	const rawIsAllPageRowsSelected = ref(false)
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
		data: fileManager,
		isLoading: isFileManagerLoading,
		isPlaceholderData: isFileManagerPlaceholderData,
	} = useQuery({
		enabled: false,
		queryKey: generalRepository.getQueryKey('files', {
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
		mutateAsync: handleDeleteFileManager,
		isPending: isDeleteFileManagerLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			generalRepository.deletePage({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: generalRepository.getQueryKey('files', {
					page,
					limit: perPage,
				}),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: error.message ?? 'Erro ao apagar a página!' },
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
		mutateAsync: handleUpdateFileManager,
		isPending: isUpdateFileManagerLoading,
	} = useMutation({
		mutationFn: (data: PageModel) => generalRepository.updatePage(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: generalRepository.getQueryKey('files', {
					page,
					limit: perPage,
				}),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: error.message ?? `Erro ao atualizar a página!` },
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
		mutateAsync: handleCreateFileManager,
		isPending: isCreateFileManagerLoading,
	} = useMutation({
		mutationFn: (data: PageModel) => generalRepository.createPage(data),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: generalRepository.getQueryKey('files', {
					page,
					limit: perPage,
				}),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: error.message ?? `Erro ao criar a página!` },
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

	const formattedAllPages = computed<FileManagerTable[]>(() => {
		return (fileManager.value ?? []).map(({ id, name, slug, url }) => ({
			id: id as number,
			name,
			slug,
			url,
		}))
	})

	const countRowSelection = computed(() => {
  return rawIsAllPageRowsSelected.value
    ? pageMetadata.value.totalItens
    : Object.keys(rowSelection.value).length
})

	const isAllPageRowsSelected = computed(() => {
  return (
    rawIsAllPageRowsSelected.value ||
    (table.getIsAllPageRowsSelected() &&
      countRowSelection.value === pageMetadata.value.totalItens) ||
    (countRowSelection.value !== pageMetadata.value.totalItens &&
      countRowSelection.value > 0 &&
      'indeterminate')
  )
})

	const columns: ColumnDef<FileManagerTable>[] = [
		{
			id: 'select',
			header: ({ table }) =>
				h(Checkbox, {
					checked: isAllPageRowsSelected.value,
					'onUpdate:checked': (value) => {
						if (value === false) rowSelection.value = {}
						rawIsAllPageRowsSelected.value = value
						return table.toggleAllPageRowsSelected(!!value)
					},
					ariaLabel: 'Select all',
				}),
			cell: ({ row }) =>
				h(Checkbox, {
					checked: row.getIsSelected() || rawIsAllPageRowsSelected.value,
					'onUpdate:checked': (value) => {
						if (value === false && rawIsAllPageRowsSelected.value) {
							rawIsAllPageRowsSelected.value = false
						}
						return row.toggleSelected(!!value)
					},
					ariaLabel: 'Select row',
				}),

			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'objects',
			meta: 'Objetos',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPages.value.length <= 0,
						// onClick: () => handleSort('objects'),
					},
					() => [
						'Nome',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('objects')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('objects')),
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
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPages.value.length <= 0,
						// onClick: () => handleSort('type'),
					},
					// () => [
					// 	'Tipo',
					// 	h(FontAwesomeIcon, {
					// 		class: 'ml-2 h-4 w-4 bh-text-black/20',
					// 		icon: ['fas', getSort('type')],
					// 	}),
					// ],
				)
			},
			cell: ({ row }) => h('div', row.getValue('type')),
			enableHiding: false,
		},
		{
			accessorKey: 'size',
			meta: 'Tamanho',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPages.value.length <= 0,
						// onClick: () => handleSort('size'),
					},
					() => [
						'Tamanho',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('size')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('size')),
			enableHiding: false,
		},
		{
			accessorKey: 'updatedAt',
			meta: 'Atualizado em',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPages.value.length <= 0,
						// onClick: () => handleSort('updatedAt'),
					},
					() => [
						'Atualizado em',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('updatedAt')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('updatedAt')),
			enableHiding: false,
		},
		{
			id: 'actions',
			size: 0,
			cell: ({ row }) => {
				const data = row.original
				return h(
					'div',
					{ class: 'relative flex gap-2 justify-end items-center' },
					[
						// h(FileManagerUpdateAction, {
						// 	dataId: data.id,
						// 	tableFileManagerName: data.name,
						// 	'onOn-edit': onUpdateSubmit,
						// 	isLoading: isUpdateFileManagerLoading.value,
						// }),
						// h(FileManagerDeleteAction, {
						// 	dataId: data.id,
						// 	tableFileManagerName: data.name,
						// 	'onOn-delete': onDeleteSubmit,
						// 	isLoading: isDeleteFileManagerLoading.value,
						// 	isActive: true,
						// }),
					],
				)
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
		return handleCreateFileManager(
			new PageModel({
				...values,
				parentId: values?.permissions?.id,
				children: [],
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
		return handleUpdateFileManager(
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
		return handleDeleteFileManager({ id })
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
			if (!isFileManagerPlaceholderData.value) {
				page.value = to
			}
		}
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Configurações', 'GED']" />

		<div class="panel pb-4 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex gap-14 items-center justify-center">
					<titulo title="Gerenciamento eletrônico de documentos" />
				</div>
			</div>

			<div class="pb-1">
				<table-wrapper
					:table="table"
					:column-size="columns.length"
					:row-limit="formattedAllPages.length"
					:is-loading="isFileManagerLoading"
				/>

				<div :class="['flex w-full items-center justify-end px-4']">
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
