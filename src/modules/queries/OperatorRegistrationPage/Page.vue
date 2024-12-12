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
	import { useRouteQuery } from '@vueuse/router'
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
	import { operatorRepository, personRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { OperatorModel } from '@/core/models'
	import { formatCPF, valueUpdater } from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import {
		OperatorRegistrationDeleteAction,
		OperatorRegistrationForm,
		OperatorRegistrationUpdateAction,
	} from './components/table'

	type OperatorTable = {
		id: number
		name: string
		cpf: string
		email: string
		type: string
	}

	// const changeValues = {
	// 	ASC: 'DESC',
	// 	DESC: 'NONE',
	// 	NONE: 'ASC',
	// } as const

	const openCreateModal = ref(false)
	const rowSelection = ref({})
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })
	// const selectSort = useRouteQuery<string | undefined>('op-rgt-sort')
	const page = useRouteQuery('op-rgt-page', 1, { transform: Number })
	const perPage = useRouteQuery('op-rgt-per-page', 8, { transform: Number })
	const queryClient = useQueryClient()
	const notify = useNotify()

	const {
		data: operators,
		isLoading: isOperatorsLoading,
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
		onError: (error) => {
			notify.error(
				error,
				{ title: 'Erro ao apagar o operador!' },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Operador apagado com sucesso!` },
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
		onError: (error) => {
			notify.error(
				error,
				{ title: `Erro ao atualizar o operador!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Operador atualizado com sucesso!` },
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
		onError: (error) => {
			notify.error(
				error,
				{ title: `Erro ao criar o operador!` },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Operador criado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const formattedAllOperators = computed<OperatorTable[]>(() => {
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
						disabled: formattedAllOperators.value.length <= 0,
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
						disabled: formattedAllOperators.value.length <= 0,
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
						disabled: formattedAllOperators.value.length <= 0,
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
						disabled: formattedAllOperators.value.length <= 0,
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
			meta: 'Tipo de operador',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						class: 'w-full justify-start px-2 font-bold',
						disabled: formattedAllOperators.value.length <= 0,
						// onClick: () => handleSort('name'),
					},
					() => [
						'Tipo de operador',
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
			header: 'Ações',
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
			return formattedAllOperators.value
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
		personId: z
			.string({ message: 'A pessoa é obrigatória.' })
			.min(1, { message: 'A pessoa é obrigatória.' }),
		name: z
			.string({ message: 'O nome é obrigatório.' })
			.min(1, { message: 'O nome é obrigatório.' }),
		cpf: z
			.string({ message: 'O CPF é obrigatório.' })
			.min(1, { message: 'O CPF é obrigatório.' }),
		typeId: z
			.string({ message: 'O tipo é obrigatório.' })
			.min(1, { message: 'O tipo é obrigatório.' }),
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

	async function handleSearchPerson(cpf: string) {
		try {
			const person = await personRepository.getAllPersons({
				params: { cpf: cpf.replace(/\D/g, '') },
			})
			form.setValues({
				...form.values,
				personId: `${person[0].id}`,
				name: person[0].name,
				cpf: formatCPF(person[0].cpf),
			})
		} catch (error) {
			form.setFieldError('cpf', 'CPF é inválido ou a pessoa não existe.')
		}
	}

	async function handlePermissions(value: { id: string; title: string }[]) {
		console.log('handlePermissions', value)
		form.setValues({ permissions: value })
	}

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreateOperator(
			new OperatorModel({
				cpf: values.cpf,
				name: values.name,
				typeId: values.typeId,
				personId: values.personId,
				permissions: values.permissions.map(({ id }) => Number(id)),
			}),
		)
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema>,
		onClose: () => void,
	) => {
		return handleUpdateOperator(
			new OperatorModel({
				id,
				cpf: values.cpf,
				name: values.name,
				typeId: values.typeId,
				userId: values.personId,
				permissions: values.permissions.map(({ id }) => Number(id)),
			}),
		).then(() => {
			onClose()
		})
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteOperator({ id })
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
	// 			selectOperatorsRefetch()
	// 			return
	// 		}

	// 		selectSort.value = undefined
	// 		selectOperatorsRefetch()
	// 		return
	// 	}

	// 	selectSort.value = `[${key}][ASC]`
	// 	selectOperatorsRefetch()
	// }

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isOperatorsPlaceholderData.value) {
				page.value = to
			}
		}
	}

	// function handleSelectCity() {
	// 	selectOperatorsRefetch()
	// }

	// function handleClear() {}
</script>

<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Operadores']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex gap-10 items-center justify-center">
					<titulo title="Gerenciar operadores" />

					<form-wrapper
						v-model="openCreateModal"
						:is-loading="isCreateOperatorLoading"
						:title="`Criar um novo operador`"
						description="Crie o conteúdo de um novo operador."
						class="sm:max-w-[1100px]"
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
										<p>Cadastre um novo operador</p>
									</tooltip-content>
								</tooltip>
							</tooltip-provider>
						</template>

						<template #fields>
							<operator-registration-form
								:metadata="form.values"
								:disabled="isCreateOperatorLoading"
								@search-cpf="handleSearchPerson"
								@update-permissions="handlePermissions"
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
					:is-loading="isOperatorsLoading"
				/>

				<div :class="['flex w-full items-center px-4']">
					<table-pagination
						v-model="page"
						:disabled="formattedAllOperators.length <= 0"
						:total-itens="pageMetadata.totalItens"
						:items-per-page="perPage"
						@update-paginate="handlePagination"
					/>
				</div>
			</div>
		</div>
	</main>
</template>
