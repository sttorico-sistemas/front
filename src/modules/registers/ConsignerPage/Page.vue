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
	import Breadcrumbs from '@/core/components/Breadcrumbs.vue'
	import Titulo from '@/core/components/Titulo.vue'
	import { consignerRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { AddressModel, ConsignerModel } from '@/core/models'
	import { valueUpdater } from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import {
		ConsignerDeleteAction,
		ConsignerForm,
		ConsignerUpdateAction,
	} from './components/table'

	type ConsignerTable = {
		id: number
		name: string
		entityType: string
		city: string
	}

	// const changeValues = {
	// 	ASC: 'DESC',
	// 	DESC: 'NONE',
	// 	NONE: 'ASC',
	// } as const

	const openCreateModal = ref(false)
	const rowSelection = ref({})
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })
	// const selectSort = useRouteQuery<string | undefined>('mtr-cgn-sort')
	const page = useRouteQuery('mtr-cgn-page', 1, { transform: Number })
	const perPage = useRouteQuery('mtr-cgn-per-page', 8, {
		transform: Number,
	})
	const queryClient = useQueryClient()
	const notify = useNotify()

	const {
		data: consigners,
		isLoading: isConsignersLoading,
		isPlaceholderData: isConsignersPlaceholderData,
	} = useQuery({
		queryKey: consignerRepository.getQueryKey('consigners', {
			page,
			limit: perPage,
		}),
		queryFn: ({ signal }) =>
			consignerRepository.getAllConsigners({
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
		mutateAsync: handleDeleteConsigner,
		isPending: isDeleteConsignerLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			consignerRepository.deleteConsigner({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: consignerRepository.getQueryKey('consigners', {
					page,
					limit: perPage,
				}),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: 'Erro ao apagar o consignante master!' },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Consignante master apagado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleUpdateConsigner,
		isPending: isUpdateConsignerLoading,
	} = useMutation({
		mutationFn: (data: ConsignerModel) =>
			consignerRepository.updateConsigner(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: consignerRepository.getQueryKey('consigners', {
					page,
					limit: perPage,
				}),
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
		mutateAsync: handleCreateConsigner,
		isPending: isCreateConsignerLoading,
	} = useMutation({
		mutationFn: (data: ConsignerModel) =>
			consignerRepository.createConsigner(data),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: consignerRepository.getQueryKey('consigners', {
					page,
					limit: perPage,
				}),
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

	const formattedAllTypeOfConsigner = computed<ConsignerTable[]>(() => {
		return (consigners.value ?? []).map(({ id, name, }) => ({
			id: id as number,
			name,
			city: name,
			entityType: name
		}))
	})

	const columns: ColumnDef<ConsignerTable>[] = [
		{
			accessorKey: 'id',
			meta: 'Código',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfConsigner.value.length <= 0,
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
						disabled: formattedAllTypeOfConsigner.value.length <= 0,
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
			accessorKey: 'city',
			meta: 'Cidade',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfConsigner.value.length <= 0,
						// onClick: () => handleSort('city'),
					},
					() => [
						'Cidade',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('city')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('city')),
			enableHiding: false,
		},
		{
			accessorKey: 'entityType',
			meta: 'Tipo de entidade',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfConsigner.value.length <= 0,
						// onClick: () => handleSort('entityType'),
					},
					() => [
						'Tipo de entidade',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('entityType')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('entityType')),
			enableHiding: false,
		},
		{
			id: 'actions',
			header: 'Ações',
			cell: ({ row }) => {
				const data = row.original
				return h('div', { class: 'relative max-w-4 flex gap-2' }, [
					h(ConsignerUpdateAction, {
						dataId: data.id,
						tableConsignerName: data.name,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdateConsignerLoading.value,
					}),
					h(ConsignerDeleteAction, {
						dataId: data.id,
						tableConsignerName: data.name,
						'onOn-delete': onDeleteSubmit,
						isLoading: isDeleteConsignerLoading.value,
						isActive: true,
					}),
				])
			},
		},
	]

	const table = useVueTable({
		get data() {
			return formattedAllTypeOfConsigner.value
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
		shortName: z
			.string({ message: 'O nome é obrigatório' })
			.min(1, { message: 'O nome é obrigatório.' }),
		cnpj: z
			.string({ message: 'O CNPJ é obrigatório.' })
			.min(1, { message: 'O CNPJ é obrigatório.' }),
		masterConsignerId: z
			.string({ message: 'O nome é obrigatório' })
			.min(1, { message: 'O nome é obrigatório.' }),
		entityTypeId: z
			.string({ message: 'O nome é obrigatório' })
			.min(1, { message: 'O nome é obrigatório.' }),
		cityId: z
			.string({ message: 'A cidade é obrigatória.' })
			.min(1, { message: 'A cidade é obrigatória.' }),
		stateId: z
			.string({ message: 'O estado é obrigatório.' })
			.min(1, { message: 'O estado é obrigatório.' }),
		street: z
			.string({ message: 'O logradouro é obrigatório.' })
			.min(1, { message: 'O logradouro é obrigatório.' }),
		zipCode: z
			.string({ message: 'O CEP é obrigatório.' })
			.min(1, { message: 'O CEP é obrigatório.' }),
		addressTypeId: z
			.string({ message: 'O tipo é obrigatório.' })
			.min(1, { message: 'O tipo é obrigatório.' }),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
	})

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreateConsigner(
			new ConsignerModel({ ...values, addresses: new AddressModel(values) }),
		)
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema>,
		onClose: () => void,
	) => {
		return handleUpdateConsigner(
			new ConsignerModel({ ...values, addresses: new AddressModel(values) }),
		).then(() => {
			onClose()
		})
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteConsigner({ id })
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
	// 			selectConsignersRefetch()
	// 			return
	// 		}

	// 		selectSort.value = undefined
	// 		selectConsignersRefetch()
	// 		return
	// 	}

	// 	selectSort.value = `[${key}][ASC]`
	// 	selectConsignersRefetch()
	// }

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isConsignersPlaceholderData.value) {
				page.value = to
			}
		}
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Cadastro', 'Consignante']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex gap-10 items-center justify-center">
					<titulo title="Gerenciar consignante" />

					<form-wrapper
						v-model="openCreateModal"
						:is-loading="isCreateConsignerLoading"
						:title="`Criar um novo consignante`"
						description="Crie o conteúdo de um novo consignante."
						class="sm:max-w-[780px]"
						@form-submit="onCreateSubmit"
					>
						<template #trigger>
							<tooltip-provider>
								<tooltip>
									<tooltip-trigger disabled as-child>
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
										<p>Cadastre um novo consignante</p>
									</tooltip-content>
								</tooltip>
							</tooltip-provider>
						</template>

						<template #fields>
							<master-consigner-form
								:metadata="form.values"
								:disabled="isCreateConsignerLoading"
							/>
						</template>
					</form-wrapper>
				</div>
			</div>

			<div class="pb-1">
				<table-wrapper
					:table="table"
					:column-size="columns.length"
					:row-limit="perPage"
					:is-loading="isConsignersLoading"
				/>

				<div :class="['flex w-full items-center px-4']">
					<table-pagination
						v-model="page"
						:disabled="formattedAllTypeOfConsigner.length <= 0"
						:total-itens="pageMetadata.totalItens"
						:items-per-page="perPage"
						@update-paginate="handlePagination"
					/>
				</div>
			</div>
		</div>
	</main>
</template>
