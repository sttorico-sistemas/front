<script lang="ts" setup>
	import { computed, h, ref } from 'vue'
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
	import { CityModel } from '@/core/models'
	import { cn, debounceAsync, valueUpdater } from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import { CityDeleteAction, CityForm, CityUpdateAction } from '../table'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	type CityTable = {
		id: number
		name: string
		uf: string
	}

	const changeValues = {
		ASC: 'DESC',
		DESC: 'NONE',
		NONE: 'ASC',
	} as const

	const openCreateModal = ref(false)
	const openCityBox = ref(false)
	const rowSelection = ref({})
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })
	const formattedSearchCities = useLocalStorage<{ id: string; name: string }[]>(
		'aux-sch-cities',
		[],
	)
	const selectCity = useRouteQuery<string | undefined>('aux-city', undefined)
	const selectUf = useRouteQuery<string | undefined>('aux-uf', undefined)
	const selectSort = useRouteQuery<string | undefined>('mtr-cgn-sort')
	const page = useRouteQuery('aux-page', 1, { transform: Number })
	const perPage = useRouteQuery('aux-per-page', 8, {
		transform: Number,
	})
	const queryClient = useQueryClient()
	const notify = useNotify()

	const { data: statesData } = useQuery({
		queryKey: auxiliaryRepository.getQueryKey('states'),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllStates({
				signal,
				params: {
					perPage: 27,
				},
			}),
	})

	const {
		data: cities,
		isLoading: isCitiesLoading,
		isPlaceholderData: isCitiesPlaceholderData,
	} = useQuery({
		queryKey: auxiliaryRepository.getQueryKey(
			'cities',
			{
				page,
				limit: perPage,
			},
			selectCity,
			selectUf,
		),
		queryFn: ({ signal }) =>
			auxiliaryRepository.getAllCities({
				signal,
				params: {
					page: page.value,
					perPage: perPage.value,
					estado_id: selectUf.value,
					search: selectCity.value,
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

	const { mutateAsync: handleDeleteCity, isPending: isDeleteCityLoading } =
		useMutation({
			mutationFn: ({ id }: { id: number }) =>
				auxiliaryRepository.deleteGenericAuxiliary({
					id,
					basePath: 'auxiliary/cidade',
				}),
			onSettled: async () => {
				await queryClient.invalidateQueries({
					queryKey: auxiliaryRepository.getQueryKey(
						'cities',
						{
							page,
							limit: perPage,
						},
						selectCity,
						selectUf,
					),
				})
			},
			onError: (error) => {
				notify.error(
					error,
					{ title: error.message ?? 'Erro ao apagar a cidade!' },
					{ duration: 1500 },
				)
			},
			onSuccess: () => {
				notify.success(
					{ title: `Cidade apagada com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const { mutateAsync: handleUpdateCity, isPending: isUpdateCityLoading } =
		useMutation({
			mutationFn: (data: CityModel) =>
				auxiliaryRepository.updateGenericAuxiliary(data),
			onSettled: async () => {
				return await queryClient.invalidateQueries({
					queryKey: auxiliaryRepository.getQueryKey(
						'cities',
						{
							page,
							limit: perPage,
						},
						selectCity,
						selectUf,
					),
				})
			},
			onError: (error) => {
				notify.error(
					error,
					{ title: error.message ?? `Erro ao atualizar a cidade!` },
					{ duration: 1500 },
				)
			},
			onSuccess: () => {
				notify.success(
					{ title: `Cidade atualizada com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const { mutateAsync: handleCreateCity, isPending: isCreateCityLoading } =
		useMutation({
			mutationFn: (data: CityModel) =>
				auxiliaryRepository.createGenericAuxiliary(data),
			onSettled: async () => {
				await queryClient.invalidateQueries({
					queryKey: auxiliaryRepository.getQueryKey(
						'cities',
						{
							page,
							limit: perPage,
						},
						selectCity,
						selectUf,
					),
				})
			},
			onError: (error) => {
				notify.error(
					error,
					{ title: error.message ?? `Erro ao criar a cidade!` },
					{ duration: 1500 },
				)
			},
			onSuccess: () => {
				notify.success(
					{ title: `Cidade criada com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const formattedAllCities = computed(() => {
		return (cities.value ?? []).map(({ id, name, stateName, stateId }) => ({
			id: id as number,
			name,
			stateId,
			uf: stateName as string,
		}))
	})

	const formattedAllStates = computed(() => {
		return (statesData.value ?? []).map(({ id, name }) => ({ id, name }))
	})

	const columns: ColumnDef<CityTable>[] = [
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
						disabled: formattedAllCities.value.length <= 0,
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
			meta: 'Descrição',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllCities.value.length <= 0,
						onClick: () => handleSort('name'),
					},
					() => [
						'Descrição',
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
			accessorKey: 'uf',
			meta: 'Estado',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllCities.value.length <= 0,
						onClick: () => handleSort('uf'),
					},
					() => [
						'Estado',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('uf')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('uf')),
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
						h(CityUpdateAction, {
							dataId: data.id,
							tableCityName: data.name,
							'onOn-edit': onUpdateSubmit,
							isLoading: isUpdateCityLoading.value,
						}),
						h(CityDeleteAction, {
							dataId: data.id,
							tableCityName: data.name,
							'onOn-delete': onDeleteSubmit,
							isLoading: isDeleteCityLoading.value,
							isActive: true,
						}),
					],
				)
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
		name: z
			.string({ message: 'O nome é obrigatório.' })
			.min(1, { message: 'O nome é obrigatório.' }),
		stateId: z
			.string({ message: 'O aniversário é obrigatório.' })
			.min(1, { message: 'O aniversário é obrigatório.' }),
		ibgeCode: z
			.string({ message: 'O CPF é obrigatório.' })
			.min(1, { message: 'O CPF é obrigatório.' }),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
	})

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreateCity(
			new CityModel({
				name: values.name,
				ibgeId: +values.ibgeCode,
				stateId: +values.stateId,
				basePath: 'auxiliary/cidade',
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
		return handleUpdateCity(
			new CityModel({
				id: `${id}`,
				name: values.name,
				ibgeId: +values.ibgeCode,
				stateId: +values.stateId,
				basePath: 'auxiliary/cidade',
			}),
		).then(() => {
			onClose()
		})
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteCity({ id })
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
			if (!isCitiesPlaceholderData.value) {
				page.value = to
			}
		}
	}

	function handleClear() {
		selectCity.value = undefined
		selectUf.value = undefined
	}

	const handleSearchCities = debounceAsync(async (value: string) => {
		return auxiliaryRepository
			.getAllCities({
				params: { search: value, estado_id: selectUf.value, perPage: 5 },
			})
			.then((response) => {
				formattedSearchCities.value = response.map(({ id, name }) => ({
					id: `${id}`,
					name,
				}))
				return response
			})
	}, 500)
</script>
<template>
	<div class="panel mt-6">
		<div
			class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
		>
			<div class="flex gap-14 items-center justify-center">
				<titulo title="Cadastro de Cidades" />

				<form-wrapper
					v-model="openCreateModal"
					:is-loading="isCreateCityLoading"
					:title="`Cadastro Cidade`"
					class="sm:max-w-[440px]"
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
									>
										<font-awesome-icon
											class="text-primary w-5 h-5"
											:icon="['fas', 'circle-plus']"
										/>
									</button-root>
								</tooltip-trigger>
								<tooltip-content side="right">
									<p>Cadastro Cidade</p>
								</tooltip-content>
							</tooltip>
						</tooltip-provider>
					</template>

					<template #fields>
						<city-form
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
					v-model="selectUf"
				>
					<select-trigger class="lg:max-w-40">
						<select-value class="text-left" placeholder="Estado" />
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
							class="w-full max-w-56 flex justify-between items-center"
						>
							{{
								selectCity
									? formattedSearchCities.find(
											(searchCities) => searchCities.name === selectCity,
										)?.name
									: 'Cidade'
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
				:is-loading="isCitiesLoading"
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
