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
	import Breadcrumbs from '@/core/components/Breadcrumbs.vue'
	import Titulo from '@/core/components/Titulo.vue'
	import { InputRoot } from '@/core/components/fields/input'
	import {
		iamRepository,
		operatorRepository,
		personRepository,
	} from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { OperatorModel, PermissionList, PermissionModel } from '@/core/models'
	import { debounceAsync, formatCPF, generatePrint, valueUpdater } from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import {
		OperatorRegistrationDeleteAction,
		OperatorRegistrationForm,
		OperatorRegistrationUpdateAction,
	} from './components/table'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	type OperatorTable = {
		id: number
		name: string
		cpf: string
		email: string
		type: string
		status: string
	}

	const statusItems = [
		{ value: 'active', label: 'Ativado' },
		{ value: 'inactive', label: 'Desativado' },
	] as const

	const changeValues = {
		ASC: 'DESC',
		DESC: 'NONE',
		NONE: 'ASC',
	} as const

	const openCreateModal = ref(false)
	const rowSelection = ref({})
	const selectPermissions = ref<PermissionModel[]>([])
	const name = ref<string | undefined>(undefined)
	const cpf = ref<string | undefined>(undefined)
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })
	const selectSort = useRouteQuery<string | undefined>('op-rgt-sort')
	const selectName = useRouteQuery<string | undefined>('opr-name', undefined)
	const selectCPF = useRouteQuery<string | undefined>('opr-cpf', undefined)
	const selectOperatorType = useRouteQuery<string | undefined>(
		'opr-type',
		undefined,
	)
	const page = useRouteQuery('op-rgt-page', 1, { transform: Number })
	const perPage = useRouteQuery('op-rgt-per-page', 8, { transform: Number })
	const queryClient = useQueryClient()
	const notify = useNotify()

	const {
		data: operators,
		isLoading: isOperatorsLoading,
		isPlaceholderData: isOperatorsPlaceholderData,
	} = useQuery({
		queryKey: operatorRepository.getQueryKey(
			'operators',
			{
				page,
				limit: perPage,
			},
			selectName,
			selectCPF,
			selectOperatorType,
		),
		queryFn: ({ signal }) =>
			operatorRepository.getAllOperators({
				signal,
				params: {
					page: page.value,
					perPage: perPage.value,
					search: selectName.value,
					cpf: selectCPF.value,
					tipo_operador_id: selectOperatorType.value,
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

	const { data: typeOfOperators, isLoading: isTypeOfOperatorsLoading } =
		useQuery({
			queryKey: iamRepository.getQueryKey('type-of-operators'),
			queryFn: ({ signal }) =>
				iamRepository.getTypeOfOperators({ signal, params: { perPage: 100 } }),
		})

	const {
		mutateAsync: handleDeleteOperator,
		isPending: isDeleteOperatorLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			operatorRepository.activateOperator({ id }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: operatorRepository.getQueryKey(
					'operators',
					{
						page,
						limit: perPage,
					},
					selectName,
					selectCPF,
					selectOperatorType,
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: error.message ?? 'Erro ao apagar o operador!' },
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
			await queryClient.invalidateQueries({
				queryKey: operatorRepository.getQueryKey('pages'),
			})
			return await queryClient.invalidateQueries({
				queryKey: operatorRepository.getQueryKey(
					'operators',
					{
						page,
						limit: perPage,
					},
					selectName,
					selectCPF,
					selectOperatorType,
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: error.message ?? `Erro ao atualizar o operador!` },
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
				queryKey: operatorRepository.getQueryKey(
					'operators',
					{
						page,
						limit: perPage,
					},
					selectName,
					selectCPF,
					selectOperatorType,
				),
			})
		},
		onError: (error) => {
			notify.error(
				error,
				{ title: error.message ?? `Erro ao criar o operador!` },
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
			({ id, cpf, email, name, typeName, status }) => ({
				id: id as number,
				name,
				email: email as string,
				cpf: formatCPF(cpf),
				type: typeName as string,
				status: status as string,
			}),
		)
	})

	const formattedAllTypeOperators = computed(() => {
		return (typeOfOperators.value ?? []).map(({ id, name }) => ({
			value: `${id}`,
			label: name,
		}))
	})

	const columns: ColumnDef<OperatorTable>[] = [
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
						disabled: formattedAllOperators.value.length <= 0,
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
			accessorKey: 'cpf',
			meta: 'CPF',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllOperators.value.length <= 0,
						onClick: () => handleSort('name'),
					},
					() => [
						'CPF',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('name')],
						}),
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
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllOperators.value.length <= 0,
						onClick: () => handleSort('name'),
					},
					() => [
						'E-mail',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('name')],
						}),
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
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllOperators.value.length <= 0,
						onClick: () => handleSort('name'),
					},
					() => [
						'Tipo de operador',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('name')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('type')),
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
						h(OperatorRegistrationUpdateAction, {
							dataId: data.id,
							tableOperatorName: data.name,
							'onOn-edit': onUpdateSubmit,
							isLoading: isUpdateOperatorLoading.value,
							isActive: data.status === 'active',
						}),
						h(OperatorRegistrationDeleteAction, {
							dataId: data.id,
							tableOperatorName: data.name,
							'onOn-delete': onDeleteSubmit,
							isLoading: isDeleteOperatorLoading.value,
							isActive: data.status === 'active',
						}),
					],
				)
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

	async function handlePermissions(value: PermissionModel[]) {
		selectPermissions.value = value
		form.setValues({
			permissions: value.map(({ id, relatedName }) => ({
				id: `${id}`,
				title: relatedName,
			})),
		})
	}

	const onCreateSubmit = form.handleSubmit(async (values) => {
		const generatePermissions = values.permissions.map(
			({ id, title }) =>
				new PermissionModel({
					id: +id,
					relatedName: title,
					action: '',
					permissibleId: '1',
					permissibleType: '',
				}),
		)
		const permissionsList = new PermissionList(
			selectPermissions.value as PermissionModel[],
		)
		permissionsList.update(generatePermissions)

		return handleCreateOperator(
			new OperatorModel({
				cpf: values.cpf,
				name: values.name,
				typeId: values.typeId,
				personId: values.personId,
				permissions: permissionsList.getItems().map(({ id }) => Number(id)),
				deletedPermissions: permissionsList
					.getRemovedItems()
					.map(({ id }) => Number(id)),
			}),
		).then(() => {
			openCreateModal.value = false
		})
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema> & {
			addPermissions: number[]
			deletedPermissions: number[]
			userId: string
		},
		onClose: () => void,
	) => {
		return handleUpdateOperator(
			new OperatorModel({
				id,
				cpf: values.cpf,
				name: values.name,
				typeId: values.typeId,
				userId: values.userId,
				permissions: values.addPermissions,
				deletedPermissions: values.deletedPermissions,
			}),
		).then(() => {
			onClose()
		})
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
			if (!isOperatorsPlaceholderData.value) {
				page.value = to
			}
		}
	}

	const handleSearch = debounceAsync(async (value: string | number) => {
		selectName.value = value.toString().trim()
	}, 500)

	const handleSearchCpf = debounceAsync(async (value: string | number) => {
		selectCPF.value = value.toString().trim().replace(/\D+/g, '')
	}, 500)

	// function handleSelectCity() {
	// 	selectOperatorsRefetch()
	// }

	function handleClear() {
		selectName.value = undefined
		name.value = undefined
		selectCPF.value = undefined
		cpf.value = undefined
		selectOperatorType.value = undefined
	}
</script>

<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Operadores']" />

		<div class="panel pb-4 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div
					class="flex flex-1 gap-14 items-center justify-between lg:justify-start lg:flex-initial"
				>
					<titulo title="Gerenciar Operadores" />

					<form-wrapper
						v-model="openCreateModal"
						:is-loading="isCreateOperatorLoading"
						:title="`Cadastro Operador`"
						class="sm:max-w-[1100px]"
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
								@on-close="openCreateModal = false"
							/>
						</template>
					</form-wrapper>
				</div>

				<div class="header_actions flex items-center gap-5 flex-1 justify-end">
					<input-root
						class="lg:max-w-80"
						v-model:model-value="name"
						placeholder="Nome"
						@update:model-value="handleSearch"
					/>

					<input-root
						class="lg:max-w-80"
						v-model:model-value="cpf"
						v-maska="'###.###.###-##'"
						placeholder="CPF"
						@update:model-value="handleSearchCpf"
					/>

					<select-root v-model="selectOperatorType">
						<select-trigger class="lg:max-w-80">
							<select-value class="text-left" placeholder="Tipo de operador" />
						</select-trigger>
						<select-content>
							<select-group>
								<select-label>Tipo de operador:</select-label>
								<select-item
									v-for="typeOperators of formattedAllTypeOperators"
									:key="typeOperators.value"
									:value="typeOperators.value.toString()"
									>{{ typeOperators.label }}</select-item
								>
							</select-group>
						</select-content>
					</select-root>

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
								<p>Limpar pesquisa</p>
							</tooltip-content>
						</tooltip>
					</tooltip-provider>

					<tooltip-provider>
						<tooltip>
							<tooltip-trigger as-child>
								<button-root
									variant="ghost"
									size="icon"
									@click="
										generatePrint({
											columns,
											data: formattedAllOperators,
											title: 'Gerenciar Operadores',
										})
									"
								>
									<font-awesome-icon
										class="text-primary w-5 h-5"
										:icon="['fas', 'print']"
									/>
								</button-root>
							</tooltip-trigger>
							<tooltip-content side="right">
								<p>Imprimir</p>
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
					:is-loading="isOperatorsLoading"
				/>

				<div :class="['flex w-full items-center justify-end px-4']">
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
