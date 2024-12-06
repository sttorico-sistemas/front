<script lang="ts" setup>
	import { computed, h, Ref, ref } from 'vue'
	import * as z from 'zod'
	import { useForm } from 'vee-validate'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useRouteQuery } from '@vueuse/router'
	import { useLocalStorage } from '@vueuse/core'
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
	import Titulo from 'src/core/components/Titulo.vue'
	import { auxiliaryRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { AuxiliaryModel } from '@/core/models'
	import { cn, valueUpdater } from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import { TypeDeleteAction, TypeForm, TypeUpdateAction } from '../table'

	type TypeTable = {
		id: number
		name: string
	}

	// const changeValues = {
	// 	ASC: 'DESC',
	// 	DESC: 'NONE',
	// 	NONE: 'ASC',
	// } as const

	const openCreateModal = ref(false)
	const rowSelection = ref({})
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })
	const selectType = useRouteQuery<string | undefined>('aux-type', undefined)
	// const selectSort = useRouteQuery<string | undefined>('aux-sort')
	const page = useRouteQuery('aux-page', 1, { transform: Number })
	const perPage = useRouteQuery('aux-per-page', 8, {
		transform: Number,
	})
	const queryClient = useQueryClient()
	const notify = useNotify()

	const enabledSelectType = computed(() => !!selectType?.value)

	const { data: allRawTypeTables } = useQuery({
		queryKey: auxiliaryRepository.getQueryKey('types'),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllAuxiliaryBases({
				signal,
				metaCallback: (meta, response) => {
					if (response.length > 0 && !selectType.value) {
						selectType.value = response[0].childrenUrl.toString()
					}
				},
			}),
	})

	const {
		data: selectAuxiliaries,
		isLoading: isTypesLoading,
		isPlaceholderData: isTypesPlaceholderData,
	} = useQuery({
		enabled: enabledSelectType,
		queryKey: auxiliaryRepository.getQueryKey(selectType as Ref<string>, {
			page,
			limit: perPage,
		}),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllGenericAuxiliaries(selectType.value as string, {
				signal,
				params: { page: page.value, perPage: perPage.value },
				metaCallback: (meta) => {
					pageMetadata.value = {
						totalItens: meta.total,
						totalPages: meta.last_page,
					}
				},
			}),
		placeholderData: keepPreviousData,
	})

	const { mutateAsync: handleDeleteType, isPending: isDeleteTypeLoading } =
		useMutation({
			mutationFn: ({ id }: { id: number }) =>
				auxiliaryRepository.deleteGenericAuxiliary({
					id,
					basePath: selectType.value as string,
				}),
			onSettled: async () => {
				await queryClient.invalidateQueries({
					queryKey: auxiliaryRepository.getQueryKey(selectType as Ref<string>, {
						page,
						limit: perPage,
					}),
				})
			},
			onError: (error) => {
				notify.error(
					error,
					{ title: 'Erro ao apagar o tipo!' },
					{ duration: 1500 },
				)
			},
			onSuccess: () => {
				notify.success(
					{ title: `Tipo apagado com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const { mutateAsync: handleUpdateType, isPending: isUpdateTypeLoading } =
		useMutation({
			mutationFn: (data: AuxiliaryModel) =>
				auxiliaryRepository.updateGenericAuxiliary(data),
			onSettled: async () => {
				return await queryClient.invalidateQueries({
					queryKey: auxiliaryRepository.getQueryKey(selectType as Ref<string>, {
						page,
						limit: perPage,
					}),
				})
			},
			onError: (error) => {
				notify.error(
					error,
					{ title: `Erro ao atualizar o tipo!` },
					{ duration: 1500 },
				)
			},
			onSuccess: () => {
				notify.success(
					{ title: `Tipo atualizado com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const { mutateAsync: handleCreateType, isPending: isCreateTypeLoading } =
		useMutation({
			mutationFn: (data: AuxiliaryModel) =>
				auxiliaryRepository.createGenericAuxiliary(data),
			onSettled: async () => {
				await queryClient.invalidateQueries({
					queryKey: auxiliaryRepository.getQueryKey(selectType as Ref<string>, {
						page,
						limit: perPage,
					}),
				})
				openCreateModal.value = false
			},
			onError: (error) => {
				notify.error(
					error,
					{ title: `Erro ao criar o tipo!` },
					{ duration: 1500 },
				)
			},
			onSuccess: () => {
				notify.success(
					{ title: `Tipo criado com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const formattedAllAuxiliaries = computed(() => {
		return (allRawTypeTables.value ?? []).map(({ childrenUrl, name }) => ({
			id: childrenUrl,
			name,
		}))
	})

	const formattedSelectedType = computed(() => {
		return (selectAuxiliaries.value ?? []).map(({ id, name }) => ({
			id: id as number,
			name,
		}))
	})

	const columns: ColumnDef<TypeTable>[] = [
		{
			accessorKey: 'id',
			meta: 'Código',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedSelectedType.value.length <= 0,
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
			meta: 'Descrição',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedSelectedType.value.length <= 0,
						// onClick: () => handleSort('name'),
					},
					() => [
						'Descrição',
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
					h(TypeUpdateAction, {
						dataId: data.id,
						tableTypeName: data.name,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdateTypeLoading.value,
						baseUrl: selectType.value as string,
					}),
					h(TypeDeleteAction, {
						dataId: data.id,
						tableTypeName: data.name,
						'onOn-delete': onDeleteSubmit,
						isLoading: isDeleteTypeLoading.value,
						isActive: true,
					}),
				])
			},
		},
	]

	const table = useVueTable({
		get data() {
			return formattedSelectedType.value
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
			.string({ message: 'O nome é obrigatório.' })
			.min(1, { message: 'O nome é obrigatório.' }),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
	})

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreateType(
			new AuxiliaryModel({
				name: values.name,
				basePath: selectType.value,
			}),
		)
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema>,
		onClose: () => void,
	) => {
		return handleUpdateType(
			new AuxiliaryModel({
				id: `${id}`,
				name: values.name,
				basePath: selectType.value,
			}),
		).then(() => {
			onClose()
		})
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteType({ id })
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
	// 			selectTypesRefetch()
	// 			return
	// 		}

	// 		selectSort.value = undefined
	// 		selectTypesRefetch()
	// 		return
	// 	}

	// 	selectSort.value = `[${key}][ASC]`
	// 	selectTypesRefetch()
	// }

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isTypesPlaceholderData.value) {
				page.value = to
			}
		}
	}

	function handleClear() {
		selectType.value = undefined
	}
</script>
<template>
	<div class="panel mt-6">
		<div
			class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
		>
			<div class="flex gap-10 items-center justify-center">
				<titulo title="Cadastro de tipos" />

				<form-wrapper
					v-model="openCreateModal"
					:is-loading="isCreateTypeLoading"
					:title="`Criar novo tipo`"
					description="Crie o conteúdo do novo tipo."
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
									<p>Cadastre um nova tabela auxiliar</p>
								</tooltip-content>
							</tooltip>
						</tooltip-provider>
					</template>

					<template #fields>
						<type-form
							:metadata="form.values"
							:disabled="isCreateTypeLoading"
						/>
					</template>
				</form-wrapper>
			</div>

			<div class="header_actions flex items-center gap-4 flex-1 justify-end">
				<select-root
					:disabled="formattedAllAuxiliaries.length <= 0"
					v-model:model-value="selectType"
					:defaultValue="selectType"
				>
					<select-trigger class="lg:max-w-96 w-full">
						<select-value
							class="text-left"
							placeholder="Selecione a categoria..."
						/>
					</select-trigger>
					<select-content>
						<select-group>
							<select-label>Categorias:</select-label>
							<select-item
								v-for="auxiliary of formattedAllAuxiliaries"
								:key="auxiliary.id"
								:value="auxiliary.id.toString()"
								>{{ auxiliary.name }}</select-item
							>
						</select-group>
					</select-content>
				</select-root>

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
				:is-loading="isTypesLoading"
			/>

			<div :class="['flex w-full items-center px-4']">
				<div class="flex-1 text-sm text-muted-foreground">
					<!-- {{ formattedAllAuxiliaries.length }} de {{ pageMetadata.totalItens }} linha(s)
					selecionadas. -->
				</div>

				<TablePagination
					v-model="page"
					:disabled="formattedAllAuxiliaries.length <= 0"
					:total-itens="pageMetadata.totalItens"
					:items-per-page="perPage"
					@update-paginate="handlePagination"
				/>
			</div>
		</div>
	</div>
</template>
