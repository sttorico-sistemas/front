<script lang="ts" setup>
	import { computed, h, ref } from 'vue'
	import * as z from 'zod'
	import { useForm } from 'vee-validate'
	import { toTypedSchema } from '@vee-validate/zod'
	import { useRouteQuery } from '@vueuse/router'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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
	import { generalRepository, serviceRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { IconData, ServiceModel } from '@/core/models'
	import { valueUpdater } from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import {
		ServiceDeleteAction,
		ServiceForm,
		ServiceUpdateAction,
	} from './components/table'

	type ServiceTable = {
		id: number
		name: string
		icon: IconData
		color: string
		theme: string
	}

	const changeValues = {
		ASC: 'DESC',
		DESC: 'NONE',
		NONE: 'ASC',
	} as const

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
		data: services,
		isLoading: isServicesLoading,
		isPlaceholderData: isServicesPlaceholderData,
	} = useQuery({
		queryKey: serviceRepository.getQueryKey('services', {
			page,
			limit: perPage,
		}),
		queryFn: ({ signal }) =>
			serviceRepository.getAllServices({
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
		mutateAsync: handleDeleteService,
		isPending: isDeleteServiceLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			serviceRepository.deleteService({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: serviceRepository.getQueryKey('services', {
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
		mutateAsync: handleUpdateService,
		isPending: isUpdateServiceLoading,
	} = useMutation({
		mutationFn: (data: ServiceModel) => serviceRepository.updateService(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: serviceRepository.getQueryKey('services', {
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
		mutateAsync: handleCreateService,
		isPending: isCreateServiceLoading,
	} = useMutation({
		mutationFn: (data: ServiceModel) => serviceRepository.createService(data),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: serviceRepository.getQueryKey('services', {
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

	const formattedAllPages = computed<ServiceTable[]>(() => {
		return (services.value ?? []).map(({ id, name, icon, color, theme }) => ({
			id: id as number,
			name,
			icon,
			color,
			theme,
		}))
	})

	const columns: ColumnDef<ServiceTable>[] = [
		{
			accessorKey: 'name',
			meta: 'Nome',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPages.value.length <= 0,
						onClick: () => handleSort('name'),
					},
					() => [
						'Nome',
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
			accessorKey: 'icon',
			meta: 'Icon',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPages.value.length <= 0,
						onClick: () => handleSort('icon'),
					},
					() => [
						'Icon',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('icon')],
						}),
					],
				)
			},
			cell: ({ row }) => {
				const data = row.original
				return h(
					'div',
					{ class: 'flex justify-center items-center' },
					h(
						'div',
						{
							class: 'w-7 h-7 rounded-full flex justify-center items-center',
							style: { backgroundColor: data.color },
						},
						h(FontAwesomeIcon, {
							style: { color: data.theme === 'dark' ? '#FFFFFF' : '#000000' },
							icon: [data.icon.family, data.icon.name],
						}),
					),
				)
			},
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
						h(ServiceUpdateAction, {
							dataId: data.id,
							tableServiceName: data.name,
							'onOn-edit': onUpdateSubmit,
							isLoading: isUpdateServiceLoading.value,
						}),
						h(ServiceDeleteAction, {
							dataId: data.id,
							tableServiceName: data.name,
							'onOn-delete': onDeleteSubmit,
							isLoading: isDeleteServiceLoading.value,
							isActive: true,
						}),
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
		color: z
			.string({ message: 'O icon é obrigatório.' })
			.min(1, { message: 'O icon é obrigatório.' }),
		theme: z
			.string({ message: 'A url é obrigatória.' })
			.min(1, { message: 'A url é obrigatória.' }),
		iconFamily: z
			.string({ message: 'A url é obrigatória.' })
			.min(1, { message: 'A url é obrigatória.' }),
		iconName: z
			.string({ message: 'A url é obrigatória.' })
			.min(1, { message: 'A url é obrigatória.' }),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
	})

	const onCreateSubmit = form.handleSubmit(
		async ({ iconFamily, iconName, ...rest }) => {
			return handleCreateService(
				new ServiceModel({
					...rest,
					icon: {
						family: iconFamily,
						name: iconName,
					},
				}),
			).then(() => {
				openCreateModal.value = false
			})
		},
	)

	const onUpdateSubmit = async (
		id: number,
		{ iconFamily, iconName, ...rest }: z.infer<typeof formSchema>,
		onClose: () => void,
	) => {
		return handleUpdateService(
			new ServiceModel({
				...rest,
				icon: {
					family: iconFamily,
					name: iconName,
				},
				id: id,
			}),
		).then(() => {
			onClose()
		})
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteService({ id })
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
			if (!isServicesPlaceholderData.value) {
				page.value = to
			}
		}
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Configurações', 'Serviços']" />

		<div class="panel pb-4 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex gap-14 items-center justify-center">
					<titulo title="Gerenciar Serviços" />

					<form-wrapper
						v-model="openCreateModal"
						:is-loading="isCreateServiceLoading"
						:title="`Cadastro Serviço`"
						class="sm:max-w-[780px]"
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
										<p>Cadastro Serviço</p>
									</tooltip-content>
								</tooltip>
							</tooltip-provider>
						</template>

						<template #fields>
							<service-form
								:metadata="form.values"
								:disabled="isCreateServiceLoading"
								@on-close="openCreateModal = false"
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
					:is-loading="isServicesLoading"
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
