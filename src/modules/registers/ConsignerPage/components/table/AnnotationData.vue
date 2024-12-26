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
		DateFormatter,
		getLocalTimeZone,
		type DateValue,
	} from '@internationalized/date'

	import {
		Popover,
		PopoverContent,
		PopoverTrigger,
	} from '@/core/components/popover'
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
	import { Calendar } from '@/core/components/calendar'
	import { InputRoot } from '@/core/components/fields/input'
	import Titulo from '@/core/components/Titulo.vue'
	import { annotationRepository, operatorRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { AnnotationModel } from '@/core/models'
	import { cn, debounceAsync, valueUpdater } from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import {
		AnnotationUpdateAction,
		AnnotationForm,
		AnnotationDeleteAction,
	} from '@/modules/registers/ConsignerPage/components/table'

	type AnnotationTable = {
		id: number
		title: string
		operatorName: string
		createdAt: string
	}

	const openCreateModal = ref(false)
	const rowSelection = ref({})
	const search = ref<string | undefined>()
	const searchDate = ref<DateValue | undefined>()
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })
	// const selectSort = useRouteQuery<string | undefined>('cgn-sort')
	const status = useRouteQuery<string | undefined>('cgn-status', undefined)
	const selectSearch = useRouteQuery<string | undefined>(
		'cgn-search',
		undefined,
	)
	const selectDate = useRouteQuery<string | undefined>('cgn-date', undefined)
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
		queryKey: annotationRepository.getQueryKey(
			'regulations',
			{
				page,
				limit: perPage,
			},
			status,
		),
		queryFn: ({ signal }) =>
			annotationRepository.getAllRegulations({
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
		mutateAsync: handleDeleteAnnotation,
		isPending: isDeleteAnnotationLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			annotationRepository.deleteAnnotation({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: annotationRepository.getQueryKey(
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
		mutateAsync: handleUpdateAnnotation,
		isPending: isUpdateAnnotationLoading,
	} = useMutation({
		mutationFn: (data: AnnotationModel) =>
			annotationRepository.updateAnnotation(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: annotationRepository.getQueryKey(
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
		mutateAsync: handleCreateAnnotation,
		isPending: isCreateAnnotationLoading,
	} = useMutation({
		mutationFn: (data: AnnotationModel) =>
			annotationRepository.createAnnotation(data),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: annotationRepository.getQueryKey(
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

	const { data: operators, isLoading: isOperatorsLoading } = useQuery({
		queryKey: operatorRepository.getQueryKey('operators', {
			page,
			limit: perPage,
		}),
		queryFn: ({ signal }) =>
			operatorRepository.getAllOperators({
				signal,
				params: {
					page: page.value,
					perPage: perPage.value,
				},
			}),
	})

	const formattedAllTypeOfAnnotation = computed<AnnotationTable[]>(() => {
		return (regulations.value ?? []).map(
			({ id, operatorName, title, createdAt }) => ({
				id: id as number,
				operatorName,
				title,
				createdAt,
			}),
		)
	})

	const formattedAllOperators = computed(() => {
		return (operators.value ?? []).map(({ id, name }) => ({
			value: `${id}`,
			label: name,
		}))
	})

	const columns: ColumnDef<AnnotationTable>[] = [
		{
			accessorKey: 'id',
			meta: 'Código',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfAnnotation.value.length <= 0,
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
			accessorKey: 'createdAt',
			meta: 'Data',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfAnnotation.value.length <= 0,
						// onClick: () => handleSort('createdAt'),
					},
					() => [
						'Data',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('createdAt')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('createdAt')),
			enableHiding: false,
		},
		{
			accessorKey: 'title',
			meta: 'Título',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfAnnotation.value.length <= 0,
						// onClick: () => handleSort('title'),
					},
					() => [
						'Título',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('title')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('title')),
			enableHiding: false,
		},
		{
			accessorKey: 'operatorName',
			meta: 'Operador',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfAnnotation.value.length <= 0,
						// onClick: () => handleSort('operatorName'),
					},
					() => [
						'Operador',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('operatorName')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('operatorName')),
			enableHiding: false,
		},
		{
			id: 'actions',
			header: 'Ações',
			cell: ({ row }) => {
				const data = row.original
				return h('div', { class: 'relative max-w-4 flex gap-2' }, [
					h(AnnotationUpdateAction, {
						dataId: data.id,
						tableAnnotationName: data.title,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdateAnnotationLoading.value,
						isActive: true,
					}),
					h(AnnotationDeleteAction, {
						dataId: data.id,
						tableAnnotationName: data.title,
						'onOn-delete': onDeleteSubmit,
						isLoading: isDeleteAnnotationLoading.value,
						isActive: true,
					}),
				])
			},
		},
	]

	const table = useVueTable({
		get data() {
			return formattedAllTypeOfAnnotation.value
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
		// return handleCreateAnnotation(
		// 	// new AnnotationModel({  }),
		// ).then(() => {
		// 	openCreateModal.value = false
		// })
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema> & { addressId: number },
		onClose: () => void,
	) => {
		// return handleUpdateAnnotation(
		// 	new AnnotationModel({
		// 		id,
		// 		...values,
		// 	}),
		// ).then(() => {
		// 	onClose()
		// })
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteAnnotation({ id })
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

	const handleSearch = debounceAsync(async (value: string | number) => {
		selectSearch.value = value.toString()
	}, 500)

	const handleSearchDate = async (value: DateValue | undefined) => {
		if (!value) return
		selectDate.value = value.toString()
	}

	function handleClear() {
		status.value = undefined
		search.value = undefined
		searchDate.value = undefined
		selectSearch.value = undefined
		selectDate.value = undefined
	}

	const df = new DateFormatter('pt-BR', {
		dateStyle: 'long',
	})
</script>

<template>
	<div class="flex flex-col gap-y-4">
		<div class="mb-4 flex gap-10 items-center">
			<div class="flex gap-10 items-center justify-center">
				<titulo title="Anotações Importantes" />

				<form-wrapper
					v-model="openCreateModal"
					:is-loading="isCreateAnnotationLoading"
					:title="`Criar um nova anotação`"
					description="Crie o conteúdo de um nova anotação."
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
									<p>Cadastre um nova anotação</p>
								</tooltip-content>
							</tooltip>
						</tooltip-provider>
					</template>

					<template #fields>
						<annotation-form
							:metadata="form.values"
							:disabled="isCreateAnnotationLoading"
						/>
					</template>
				</form-wrapper>
			</div>

			<div class="header_actions flex items-center gap-4 flex-1 justify-end">
				<input-root
					class="max-w-96"
					placeholder="Título"
					v-model="search"
					@update:model-value="handleSearch"
				/>

				<select-root class="flex-[1]" v-model="status">
					<select-trigger class="lg:max-w-80 flex-[2]">
						<select-value
							class="text-left"
							placeholder="Selecione um operador..."
						/>
					</select-trigger>
					<select-content>
						<select-group>
							<select-label>Operadores:</select-label>
							<select-item
								v-for="statusItem of formattedAllOperators"
								:key="statusItem.value"
								:value="statusItem.value.toString()"
								>{{ statusItem.label }}</select-item
							>
						</select-group>
					</select-content>
				</select-root>

				<popover>
					<popover-trigger as-child>
						<button-root
							variant="outline"
							:class="
								cn(
									'flex max-w-60 w-full justify-start text-left font-normal items-center',
									!searchDate && 'text-muted-foreground',
								)
							"
						>
							<font-awesome-icon
								class="mr-2 h-4 w-4 flex"
								:icon="['far', 'calendar']"
							/>

							{{
								searchDate
									? df.format(searchDate!.toDate(getLocalTimeZone()))
									: 'Selecione uma data'
							}}
						</button-root>
					</popover-trigger>
					<popover-Content class="w-auto p-0">
						<calendar
							v-model="searchDate"
							initial-focus
							class="col-span-3"
							@update:model-value="handleSearchDate"
						/>
					</popover-Content>
				</popover>

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
				:is-loading="isRegulationsLoading"
			/>

			<div :class="['flex w-full items-center px-4']">
				<table-pagination
					v-model="page"
					:disabled="formattedAllTypeOfAnnotation.length <= 0"
					:total-itens="pageMetadata.totalItens"
					:items-per-page="perPage"
					@update-paginate="handlePagination"
				/>
			</div>
		</div>
	</div>
</template>
