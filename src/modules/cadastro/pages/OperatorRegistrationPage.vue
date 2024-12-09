<script lang="ts" setup>
	import { computed, h, onMounted, reactive, ref } from 'vue'
	import * as z from 'zod'
	import Breadcrumbs from 'src/core/components/Breadcrumbs.vue'
	import Titulo from 'src/core/components/Titulo.vue'
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger,
	} from '@/core/components/tooltip'
	import { FormWrapper } from '@/core/components/form-wrapper'
	import { TableWrapper } from '@/core/components/table-wrapper'
	import {
		keepPreviousData,
		useMutation,
		useQuery,
		useQueryClient,
	} from '@tanstack/vue-query'
	import { operatorRepository } from '@/core/stores'
	import { useLocalStorage } from '@vueuse/core'
	import { useRouteQuery } from '@vueuse/router'
	import { useNotify } from '@/core/composables'
	import { OperatorModel } from '@/core/models'
	import { formatCPF, valueUpdater } from '@/core/utils'
	import { ColumnDef, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
	import { ButtonRoot } from '@/core/components/button'
	import { useForm } from 'vee-validate'
	import { toTypedSchema } from '@vee-validate/zod'
	import {
		OperatorRegistrationDeleteAction,
		OperatorRegistrationForm,
		OperatorRegistrationUpdateAction,
	} from './components/operator-registration-table'

	type OperatorTable = {
		id: number
		name: string
		cpf: string
		email: string
		type: string
	}

	const changeValues = {
		ASC: 'DESC',
		DESC: 'NONE',
		NONE: 'ASC',
	} as const

	const openCreateModal = ref(false)
	const rowSelection = ref({})
	const page = useRouteQuery('city-page', 1, { transform: Number })
	const perPage = useRouteQuery('city-per-page', 8, { transform: Number })
	const selectSort = useRouteQuery<string | undefined>('city-sort')
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })

	const {
		data: operators,
		isLoading: isOperatorsLoading,
		refetch: selectOperatorsRefetch,
		isPlaceholderData: isOperatorsPlaceholderData,
	} = useQuery({
		queryKey: operatorRepository.getQueryKey('operators', {
			page,
			limit: perPage,
		}),
		queryFn: ({ signal }) =>
			operatorRepository.getAllOperators({
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

	const queryClient = useQueryClient()
	const notify = useNotify()

	const {
		mutateAsync: handleDeleteOperator,
		isPending: isDeleteOperatorLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			operatorRepository.deleteOperator({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: operatorRepository.getQueryKey('operators', {
					page,
					limit: perPage,
				}),
			})
		},
		onError: (error, variables, context) => {
			notify.error(
				error,
				{ title: 'Erro ao apagar a operador!' },
				{ duration: 1500 },
			)
		},
		onSuccess: (data, variables, context) => {
			notify.success(
				{ title: `Operador apagada com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleUpdateOperator,
		isPending: isUpdateOperatorLoading,
	} = useMutation({
		mutationFn: (data: OperatorModel) =>
			operatorRepository.updateOperator(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: operatorRepository.getQueryKey('operators', {
					page,
					limit: perPage,
				}),
			})
		},
		onError: (error, variables, context) => {
			notify.success(
				{ title: `Erro ao atualizar a operador!` },
				{ duration: 1500 },
			)
		},
		onSuccess: (data, variables, context) => {
			notify.success(
				{ title: `Operador atualizada com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleCreateOperator,
		isPending: isCreateOperatorLoading,
	} = useMutation({
		mutationFn: (data: OperatorModel) =>
			operatorRepository.createOperator(data),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: operatorRepository.getQueryKey('operators', {
					page,
					limit: perPage,
				}),
			})
			openCreateModal.value = false
		},
		onError: (error, variables, context) => {
			notify.success({ title: `Erro ao criar a operador!` }, { duration: 1500 })
		},
		onSuccess: (data, variables, context) => {
			notify.success(
				{ title: `Operador criada com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const formattedAllTypeOfOperator = computed<OperatorTable[]>(() => {
		return (operators.value ?? []).map(
			({ id, cpf, email, name, typeName }) => ({
				id: id as number,
				name,
				email: email as string,
				cpf: formatCPF(cpf),
				type: typeName as string,
			}),
		)
	})

	const columns: ColumnDef<OperatorTable>[] = [
		{
			accessorKey: 'id',
			meta: 'Código',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfOperator.value.length <= 0,
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
						disabled: formattedAllTypeOfOperator.value.length <= 0,
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
			accessorKey: 'cpf',
			meta: 'CPF',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfOperator.value.length <= 0,
						// onClick: () => handleSort('name'),
					},
					() => [
						'CPF',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('name')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('cpf')),
			enableHiding: false,
		},
		{
			accessorKey: 'email',
			meta: 'E-mail',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfOperator.value.length <= 0,
						// onClick: () => handleSort('name'),
					},
					() => [
						'E-mail',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('name')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('email')),
			enableHiding: false,
		},
		{
			accessorKey: 'type',
			meta: 'Tipo Operador',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllTypeOfOperator.value.length <= 0,
						// onClick: () => handleSort('name'),
					},
					() => [
						'Tipo Operador',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('name')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('type')),
			enableHiding: false,
		},
		{
			id: 'actions',
			header: 'Ação',
			cell: ({ row }) => {
				const data = row.original
				return h('div', { class: 'relative max-w-4 flex gap-2' }, [
					h(OperatorRegistrationUpdateAction, {
						dataId: data.id,
						tableOperatorName: data.name,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdateOperatorLoading.value,
					}),
					h(OperatorRegistrationDeleteAction, {
						dataId: data.id,
						tableOperatorName: data.name,
						'onOn-delete': onDeleteSubmit,
						isLoading: isDeleteOperatorLoading.value,
						isActive: true,
					}),
				])
			},
		},
	]

	const table = useVueTable({
		get data() {
			return formattedAllTypeOfOperator.value
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
		cpf: z.string({ message: 'Esse campo é obrigatório.' }),
		typeId: z.string({ message: 'Esse campo é obrigatório.' }),
		permissions: z
			.array(
				z.object(
					{
						id: z.string({ message: 'Esse campo é obrigatório.' }),
						title: z.string({ message: 'Esse campo é obrigatório.' }),
					},
					{ message: 'Esse campo é obrigatório.' },
				),
				{
					message: 'Deve haver pelo menos 1 endereço.',
				},
			)
			.min(1, 'Deve haver pelo menos 1 endereço.'),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
		initialValues: {
			permissions: [],
		},
	})

	const onCreateSubmit = form.handleSubmit(async (values) => {
		console.log(values)
		// return handleCreateOperator(
		// 	new OperatorModel({
		// 		...values,
		// 		permissions: values.permissions.map(({ id }) => Number(id)),
		// 	}),
		// )
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema> & {
			deletedAddresses: number[]
			deletedContacts: number[]
		},
	) => {
		return handleUpdateOperator(
			new OperatorModel({
				id,
				...values,
				permissions: values.permissions.map(({ id }) => Number(id)),
			}),
		)
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteOperator({ id })
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
				selectOperatorsRefetch()
				return
			}

			selectSort.value = undefined
			selectOperatorsRefetch()
			return
		}

		selectSort.value = `[${key}][ASC]`
		selectOperatorsRefetch()
	}

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isOperatorsPlaceholderData.value) {
				page.value = to
			}
		}
	}

	function handleSelectCity() {
		selectOperatorsRefetch()
	}

	function handleClear() {}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Operadores']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex gap-10 items-center justify-center">
					<Titulo title="Gerenciar Operadores" />

					<form-wrapper
						v-model="openCreateModal"
						:is-loading="isCreateOperatorLoading"
						:title="`Criar uma nova pessoa`"
						description="Crie o conteúdo de uma nova pessoa."
						class="sm:max-w-[1100px]"
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
										<p>Cadastre uma nova pessoa</p>
									</tooltip-content>
								</tooltip>
							</tooltip-provider>
						</template>

						<template #fields>
							<OperatorRegistrationForm
								:metadata="form.values"
								:disabled="isCreateOperatorLoading"
							/>
						</template>
					</form-wrapper>
				</div>
			</div>

			<div class="datatable pb-1">
				<table-wrapper
					:table="table"
					:column-size="columns.length"
					:row-limit="perPage"
					:is-loading="isOperatorsLoading"
				/>
			</div>
		</div>
	</main>
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
