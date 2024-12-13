<script lang="ts" setup>
	import { computed, h, ref } from 'vue'
	import * as z from 'zod'
	import { useForm } from 'vee-validate'
	import { toTypedSchema } from '@vee-validate/zod'
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
	import { iamRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { AddressModel, ContactModel, ProfileModel } from '@/core/models'
	import { formatCPF, valueUpdater } from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import { IamDeleteAction, IamForm, IamUpdateAction } from './components/table'
	import { useRouteQuery } from '@vueuse/router'

	type IamTable = {
		id: number
		name: string
		description: string
		permissions: string
	}

	// const changeValues = {
	// 	ASC: 'DESC',
	// 	DESC: 'NONE',
	// 	NONE: 'ASC',
	// } as const

	const openCreateModal = ref(false)
	const rowSelection = ref({})
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })
	const page = useRouteQuery('prf-page', 1, { transform: Number })
	const perPage = useRouteQuery('prf-per-page', 8, {
		transform: Number,
	})
	const queryClient = useQueryClient()
	const notify = useNotify()

	const {
		data: iams,
		isLoading: isIamsLoading,
		isPlaceholderData: isIamsPlaceholderData,
	} = useQuery({
		queryKey: iamRepository.getQueryKey('iams', {
			page,
			limit: perPage,
		}),
		queryFn: ({ signal }) =>
			iamRepository.getTypeOfOperators({
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

	const { mutateAsync: handleDeleteIam, isPending: isDeleteIamLoading } =
		useMutation({
			mutationFn: ({ id }: { id: number }) =>
				iamRepository.deleteTypeOfOperator({ id }),
			onSettled: async () => {
				await queryClient.invalidateQueries({
					queryKey: iamRepository.getQueryKey('iams', {
						page,
						limit: perPage,
					}),
				})
			},
			onError: (error) => {
				notify.error(
					error,
					{ title: 'Erro ao apagar o perfil!' },
					{ duration: 1500 },
				)
			},
			onSuccess: () => {
				notify.success(
					{ title: `Perfil apagado com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const { mutateAsync: handleUpdateIam, isPending: isUpdateIamLoading } =
		useMutation({
			mutationFn: (data: ProfileModel) =>
				iamRepository.updateTypeOfOperator(data),
			onSettled: async () => {
				return await queryClient.invalidateQueries({
					queryKey: iamRepository.getQueryKey('iams', {
						page,
						limit: perPage,
					}),
				})
			},
			onError: (error) => {
				notify.error(
					error,
					{ title: `Erro ao atualizar o perfil!` },
					{ duration: 1500 },
				)
			},
			onSuccess: () => {
				notify.success(
					{ title: `Perfil atualizado com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const { mutateAsync: handleCreateIam, isPending: isCreateIamLoading } =
		useMutation({
			mutationFn: (data: ProfileModel) =>
				iamRepository.createTypeOfOperator(data),
			onSettled: async () => {
				await queryClient.invalidateQueries({
					queryKey: iamRepository.getQueryKey('iams', {
						page,
						limit: perPage,
					}),
				})
				openCreateModal.value = false
			},
			onError: (error) => {
				notify.error(
					error,
					{ title: `Erro ao criar o perfil!` },
					{ duration: 1500 },
				)
			},
			onSuccess: () => {
				notify.success(
					{ title: `Perfil criado com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const formattedAllIams = computed<IamTable[]>(() => {
		return (iams.value ?? []).map(({ id, name, description, permissions }) => ({
			id: id as number,
			name,
			description,
			permissions: permissions.map(({ relatedName }) => relatedName).join(', '),
		}))
	})

	const columns: ColumnDef<IamTable>[] = [
		{
			accessorKey: 'name',
			meta: 'Nome',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllIams.value.length <= 0,
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
			accessorKey: 'description',
			meta: 'Descrição',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllIams.value.length <= 0,
						// onClick: () => handleSort('slug'),
					},
					() => [
						'Descrição',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('slug')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('description')),
			enableHiding: false,
		},
		{
			accessorKey: 'permissions',
			meta: 'Permissões',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllIams.value.length <= 0,
						// onClick: () => handleSort('slug'),
					},
					() => [
						'Permissões',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('slug')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('permissions')),
			enableHiding: false,
		},
		{
			id: 'actions',
			header: 'Ações',
			cell: ({ row }) => {
				const data = row.original
				return h('div', { class: 'relative max-w-4 flex gap-2' }, [
					h(IamUpdateAction, {
						dataId: data.id,
						tableIamName: data.name,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdateIamLoading.value,
					}),
					h(IamDeleteAction, {
						dataId: data.id,
						tableIamName: data.name,
						'onOn-delete': onDeleteSubmit,
						isLoading: isDeleteIamLoading.value,
						isActive: true,
					}),
				])
			},
		},
	]

	const table = useVueTable({
		get data() {
			return formattedAllIams.value
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
		description: z
			.string({ message: 'A descrição é obrigatória.' })
			.min(1, { message: 'A descrição é obrigatória.' }),
		permissions: z
			.array(
				z.object(
					{
						id: z.string({ message: 'Esse campo é obrigatório.' }),
						title: z.string({ message: 'Esse campo é obrigatório.' }),
					},
					{ message: 'Esse campo é obrigatório.' },
				),
				{ message: 'Deve haver pelo menos 1 permissão.' },
			)
			.min(1, { message: 'Deve haver pelo menos 1 permissão.' }),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
		initialValues: {
			permissions: [],
		},
	})

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreateIam(
			new ProfileModel({
				name: values.name,
				description: values.description,
				permissionsId: values.permissions.map(({ id }) => +id),
			}),
		)
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema>,
		onClose: () => void,
	) => {
		return handleUpdateIam(
			new ProfileModel({
				id: `${id}`,
				name: values.name,
				description: values.description,
				permissionsId: values.permissions.map(({ id }) => +id),
			}),
		).then(() => {
			onClose()
		})
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteIam({ id })
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
	// 			selectIamsRefetch()
	// 			return
	// 		}

	// 		selectSort.value = undefined
	// 		selectIamsRefetch()
	// 		return
	// 	}

	// 	selectSort.value = `[${key}][ASC]`
	// 	selectIamsRefetch()
	// }

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isIamsPlaceholderData.value) {
				page.value = to
			}
		}
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Configurações', 'Perfil']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex gap-10 items-center justify-center">
					<titulo title="Gerenciar perfis" />

					<form-wrapper
						v-model="openCreateModal"
						:is-loading="isCreateIamLoading"
						:title="`Criar um novo perfil`"
						description="Crie o conteúdo de um novo perfil."
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
										<p>Cadastre um nova pessoa</p>
									</tooltip-content>
								</tooltip>
							</tooltip-provider>
						</template>

						<template #fields>
							<iam-form
								:metadata="form.values"
								:disabled="isCreateIamLoading"
							/>
						</template>
					</form-wrapper>
				</div>
			</div>

			<div class="pb-1">
				<table-wrapper
					:table="table"
					:column-size="columns.length"
					:row-limit="formattedAllIams.length"
					:is-loading="isIamsLoading"
				/>

				<div :class="['flex w-full items-center px-4']">
					<table-pagination
						v-model="page"
						:disabled="formattedAllIams.length <= 0"
						:total-itens="pageMetadata.totalItens"
						:items-per-page="perPage"
						@update-paginate="handlePagination"
					/>
				</div>
			</div>
		</div>
	</main>
</template>
