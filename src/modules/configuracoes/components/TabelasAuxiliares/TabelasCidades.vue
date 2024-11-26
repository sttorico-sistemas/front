<script lang="ts" setup>
	import { h, ref } from 'vue'
	import * as z from 'zod'
	import Swal from 'sweetalert2'
	import { FormWrapper } from '@/core/components/form-wrapper'
	import Titulo from 'src/core/components/Titulo.vue'
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
	import { useRouteQuery } from '@vueuse/router'
	import {
		keepPreviousData,
		useMutation,
		useQuery,
		useQueryClient,
	} from '@tanstack/vue-query'
	import { tabelasAuxiliaresRepository } from '../../stores'
	import { computed } from 'vue'
	import { ColumnDef, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	import { cn, debounceAsync, valueUpdater } from '@/core/utils'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useForm } from 'vee-validate'
	import { TableValue } from '../../types'
	import { DeleteTableCity, EditTableCity, TableCityForm } from './city-table'
	import {
		TableWrapper,
		TablePagination,
	} from '@/core/components/table-wrapper'
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
	} from '@/core/components/command'
	import {
		Popover,
		PopoverContent,
		PopoverTrigger,
	} from '@/core/components/popover'
	import { useLocalStorage } from '@vueuse/core'

	type CityTables = {
		id: number
		name: string
		uf: string
		ibgeCode: number
	}

	const changeValues = {
		ASC: 'DESC',
		DESC: 'NONE',
		NONE: 'ASC',
	} as const

	const openCreateModal = ref(false)
	const openCityBox = ref(false)
	const rowSelection = ref({})
	const formattedSearchCities = useLocalStorage<{ id: number; name: string }[]>(
		'search-cities',
		[],
	)
	const page = useRouteQuery('city-page', 1, { transform: Number })
	const perPage = useRouteQuery('city-per-page', 8, { transform: Number })
	const selectCity = useRouteQuery<string | undefined>('city-select', undefined)
	const selectUf = useRouteQuery<string | undefined>(
		'city-uf-select',
		undefined,
	)
	const selectSort = useRouteQuery<string | undefined>('city-sort')
	const pageMetadata = ref({
		totalPages: 1,
		totalItens: 0,
	})

	const {
		data: selectCityData,
		isLoading: isSelectCityLoading,
		refetch: selectCityRefetch,
		isPlaceholderData: isCityPlaceholderData,
	} = useQuery({
		queryKey: tabelasAuxiliaresRepository.getQueryKey(
			'cities',
			{
				page,
				limit: perPage,
			},
			selectUf,
			selectCity,
		),
		queryFn: ({ signal }) =>
			tabelasAuxiliaresRepository.getAllCities({
				params: {
					page: page.value,
					perPage: perPage.value,
					search: selectCity.value,
				},
				signal,
				metaCallback: (meta) => {
					pageMetadata.value = {
						totalItens: meta.total,
						totalPages: meta.last_page,
					}
				},
			}),
		placeholderData: keepPreviousData,
	})

	const { data: statesData } = useQuery({
		queryKey: tabelasAuxiliaresRepository.getQueryKey('states'),
		queryFn: ({ signal }) =>
			tabelasAuxiliaresRepository.getAllStates({
				signal,
			}),
	})

	const queryClient = useQueryClient()

	const { mutateAsync: handleDeleteCity, isPending: isDeleteCityLoading } =
		useMutation({
			mutationFn: ({
				tableUrl,
				valueId,
			}: {
				tableUrl: string
				valueId: number
			}) => tabelasAuxiliaresRepository.deleteTableValue(tableUrl, valueId),
			onSettled: async () => {
				formattedSearchCities.value = formattedSearchCities.value.filter(
					({ name }) => name !== selectCity.value,
				)
				await queryClient.invalidateQueries({
					queryKey: tabelasAuxiliaresRepository.getQueryKey(
						'cities',
						{
							page,
							limit: perPage,
						},
						selectUf,
						selectCity,
					),
				})
				selectCity.value = undefined
			},
			onError: (error, variables, context) => {
				Swal.fire({
					icon: 'error',
					title: 'Erro ao deletar tipo!',
					showConfirmButton: false,
					timer: 1500,
				})
			},
			onSuccess: (data, variables, context) => {
				Swal.fire({
					icon: 'success',
					title: 'Tipo deletar co sucesso!',
					showConfirmButton: false,
					timer: 1500,
				})
			},
		})

	const { mutateAsync: handleUpdateCity, isPending: isUpdateCityLoading } =
		useMutation({
			mutationFn: (tableValue: TableValue) =>
				tabelasAuxiliaresRepository.updateTableValue(tableValue),
			onSettled: async () => {
				return await queryClient.invalidateQueries({
					queryKey: tabelasAuxiliaresRepository.getQueryKey(
						'cities',
						{
							page,
							limit: perPage,
						},
						selectUf,
						selectCity,
					),
				})
			},
			onError: (error, variables, context) => {
				Swal.fire({
					icon: 'error',
					title: 'Erro ao atualizar tipo!',
					showConfirmButton: false,
					timer: 1500,
				})
			},
			onSuccess: (data, variables, context) => {
				Swal.fire({
					icon: 'success',
					title: 'Tipo atualizado com sucesso!',
					showConfirmButton: false,
					timer: 1500,
				})
			},
		})

	const { mutateAsync: handleCreateCity, isPending: isCreateCityLoading } =
		useMutation({
			mutationFn: (
				tableValue: Pick<
					TableValue & {
						estado_id: number
						ibge_id: number
					},
					'nome' | 'tableUrl' | 'ibge_id' | 'estado_id'
				>,
			) => tabelasAuxiliaresRepository.createTableValue(tableValue),
			onSettled: async () => {
				await queryClient.invalidateQueries({
					queryKey: tabelasAuxiliaresRepository.getQueryKey(
						'cities',
						{
							page,
							limit: perPage,
						},
						selectUf,
						selectCity,
					),
				})
				openCreateModal.value = false
			},
			onError: (error, variables, context) => {
				Swal.fire({
					icon: 'error',
					title: 'Erro ao cadastrar tipo!',
					showConfirmButton: false,
					timer: 1500,
				})
			},
			onSuccess: (data, variables, context) => {
				Swal.fire({
					icon: 'success',
					title: 'Tipo cadastrado co sucesso!',
					showConfirmButton: false,
					timer: 1500,
				})
			},
		})

	const formattedAllCities = computed(() => {
		return (selectCityData.value ?? []).map(({ id, name, ibgeId }) => ({
			id,
			name,
			ibgeCode: ibgeId,
			uf: '',
		}))
	})

	const formattedAllStates = computed(() => {
		return (statesData.value ?? []).map(({ id, name }) => ({ id, name }))
	})

	const columns: ColumnDef<CityTables>[] = [
		{
			accessorKey: 'id',
			meta: 'Código',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllCities.value.length <= 0,
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
						disabled: formattedAllCities.value.length <= 0,
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
			accessorKey: 'uf',
			meta: 'Estado',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllCities.value.length <= 0,
						// onClick: () => handleSort('name'),
					},
					() => [
						'Estado',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('name')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('uf')),
			enableHiding: false,
		},
		{
			accessorKey: 'ibgeCode',
			meta: 'IBGE',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllCities.value.length <= 0,
						// onClick: () => handleSort('name'),
					},
					() => [
						'IBGE',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('name')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('ibgeCode')),
			enableHiding: false,
		},
		{
			id: 'actions',
			header: 'Ação',
			cell: ({ row }) => {
				const data = row.original
				return h('div', { class: 'relative max-w-4 flex gap-2' }, [
					h(EditTableCity, {
						dataId: data.id,
						tableCityName: data.name,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdateCityLoading.value,
					}),
					h(DeleteTableCity, {
						dataId: data.id,
						tableCityName: data.name,
						'onOn-delete': onDeleteSubimit,
						isLoading: isDeleteCityLoading.value,
					}),
				])
			},
		},
	]

	const table = useVueTable({
		get data() {
			return formattedAllCities.value
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
		stateId: z.string({ message: 'Esse campo é obrigatório.' }),
		ibgeCode: z.string({ message: 'Esse campo é obrigatório.' }),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
	})

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreateCity({
			nome: values.name,
			tableUrl: 'auxiliary/cidade',
			estado_id: +values.stateId,
			ibge_id: +values.ibgeCode,
		})
	})

	const handleSearchCities = debounceAsync(async (value: string) => {
		return tabelasAuxiliaresRepository
			.getAllTableValues('auxiliary/cidade', {
				params: { search: value, perPage: 5 },
			})
			.then((response) => {
				formattedSearchCities.value = response.map(({ id, nome }) => ({
					id,
					name: nome,
				}))
				return response
			})
	}, 500)

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema>,
	) => {
		return handleUpdateCity({
			id,
			nome: values.name,
			tableUrl: 'auxiliary/cidade',
		})
	}

	const onDeleteSubimit = async (id: number) => {
		return handleDeleteCity({ tableUrl: 'auxiliary/cidade', valueId: id })
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
				selectCityRefetch()
				return
			}

			selectSort.value = undefined
			selectCityRefetch()
			return
		}

		selectSort.value = `[${key}][ASC]`
		selectCityRefetch()
	}

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isCityPlaceholderData.value) {
				page.value = to
			}
		}
	}

	function handleSelectCity() {
		selectCityRefetch()
	}
</script>

<template>
	<div class="panel mt-6">
		<div
			class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
		>
			<div class="flex gap-10 items-center justify-center">
				<titulo title="Cadastro de cidade" />

				<form-wrapper
					v-model="openCreateModal"
					:is-loading="isCreateCityLoading"
					:title="`Criar nova cidade`"
					description="Crie o conteúdo de uma nova cidade."
					class="sm:max-w-[780px]"
					@form-submit="onCreateSubmit"
				>
					<template #trigger>
						<tooltip-provider>
							<tooltip>
								<tooltip-trigger as-child>
									<button-root variant="ghost" @click="openCreateModal = true">
										<font-awesome-icon
											class="text-primary_3-table w-5 h-5"
											:icon="['fas', 'circle-plus']"
										/>
									</button-root>
								</tooltip-trigger>
								<tooltip-content side="right">
									<p>Cadastre um nova cidade</p>
								</tooltip-content>
							</tooltip>
						</tooltip-provider>
					</template>

					<template #fields>
						<TableCityForm
							:metadata="form.values"
							:disabled="isCreateCityLoading"
						/>
					</template>
				</form-wrapper>
			</div>

			<div class="header_actions flex items-center gap-4 flex-1 justify-end">
				<select-root
					class="flex-[1]"
					:disabled="formattedAllStates.length <= 0"
					v-model:model-value="selectUf"
					@update:model-value="handleSelectCity"
				>
					<select-trigger class="lg:max-w-96 flex-[2]">
						<select-value
							class="text-left"
							placeholder="Selecione um estado..."
						/>
					</select-trigger>
					<select-content>
						<select-group>
							<select-label>Estados:</select-label>
							<select-item
								v-for="state of formattedAllStates"
								:key="state.id"
								:value="state.id.toString()"
								>{{ state.name }}</select-item
							>
						</select-group>
					</select-content>
				</select-root>

				<Popover v-model:open="openCityBox">
					<PopoverTrigger as-child>
						<ButtonRoot
							variant="outline"
							role="combobox"
							:aria-expanded="openCityBox"
							class="lg:max-w-96 flex-[3] justify-between"
						>
							{{
								selectCity
									? formattedSearchCities.find(
											(searchCities) => searchCities.name === selectCity,
										)?.name
									: 'Selecione a cidade...'
							}}
							<font-awesome-icon
								v-if="openCityBox"
								:icon="['fas', 'chevron-up']"
							/>
							<font-awesome-icon v-else :icon="['fas', 'chevron-down']" />
						</ButtonRoot>
					</PopoverTrigger>
					<PopoverContent class="lg:max-w-96 flex-[3]A p-0">
						<Command
							multiple
							v-model="selectCity"
							@update:searchTerm="handleSearchCities"
						>
							<CommandInput class="h-9" placeholder="Busque uma cidade..." />
							<CommandEmpty>Nenhuma cidades encontrada.</CommandEmpty>
							<CommandList>
								<CommandGroup>
									<CommandItem
										v-for="searchCities in formattedSearchCities"
										:key="searchCities.id"
										:value="searchCities.name"
										@select="
											(ev) => {
												if (typeof ev.detail.value === 'string') {
													selectCity = ev.detail.value
												}
												openCityBox = false
											}
										"
									>
										{{ searchCities.name }}
										<font-awesome-icon
											:class="
												cn(
													'ml-auto h-4 w-4',
													selectCity === searchCities.name
														? 'opacity-100'
														: 'opacity-0',
												)
											"
											:icon="['fas', 'check']"
										/>
									</CommandItem>
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
		</div>

		<div class="datatable pb-1">
			<table-wrapper
				:table="table"
				:column-size="columns.length"
				:row-limit="perPage"
				:is-loading="isSelectCityLoading"
			/>

			<div :class="['flex w-full items-center px-4']">
				<div class="flex-1 text-sm text-muted-foreground">
					<!-- {{ formattedAllTypeTable.length }} de {{ pageMetadata.totalItens }} linha(s)
					selecionadas. -->
				</div>

				<TablePagination
					v-model="page"
					:disabled="formattedAllCities.length <= 0"
					:total-itens="pageMetadata.totalItens"
					:items-per-page="perPage"
					@update-paginate="handlePagination"
				/>
			</div>
		</div>
	</div>
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
