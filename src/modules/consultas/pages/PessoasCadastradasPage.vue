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
	import { personRepository } from '@/core/stores/person.store'
	import { useLocalStorage } from '@vueuse/core'
	import { useRouteQuery } from '@vueuse/router'
	import { useNotify } from '@/core/composables'
	import { AddressModel, ContactModel, PersonModel } from '@/core/models'
	import { formatCPF, valueUpdater } from '@/core/utils'
	import { ColumnDef, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
	import { ButtonRoot } from '@/core/components/button'
	import { useForm } from 'vee-validate'
	import { toTypedSchema } from '@vee-validate/zod'
	import {
		EditTableRegisterPerson,
		DeleteTableRegisterPerson,
		TableRegisterPersonForm,
	} from './components/register-person-table'

	type PersonTable = {
		id: number
		name: string
		cpf: string
		linkedType: string
		city: string
		email: string
		status: number
	}

	const changeValues = {
		ASC: 'DESC',
		DESC: 'NONE',
		NONE: 'ASC',
	} as const

	const openCreateModal = ref(false)
	const openNameBox = ref(false)
	const openCPFBox = ref(false)
	const rowSelection = ref({})
	const formattedSearchNames = useLocalStorage<{ id: number; name: string }[]>(
		'search-person-names',
		[],
	)
	const formattedSearchCPFs = useLocalStorage<{ id: number; name: string }[]>(
		'search-person-cpf',
		[],
	)
	const page = useRouteQuery('city-page', 1, { transform: Number })
	const perPage = useRouteQuery('city-per-page', 8, { transform: Number })
	const selectLinkedType = useRouteQuery<string | undefined>(
		'person-linked-type',
		undefined,
	)
	const selectCity = useRouteQuery<string | undefined>('person-city', undefined)
	const selectName = useRouteQuery<string | undefined>('person-name', undefined)
	const selectCPF = useRouteQuery<string | undefined>('person-cpf', undefined)
	const selectStatus = useRouteQuery<string | undefined>(
		'person-status',
		undefined,
	)
	const selectSort = useRouteQuery<string | undefined>('city-sort')
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })

	const {
		data: persons,
		isLoading: isPersonsLoading,
		refetch: selectPersonsRefetch,
		isPlaceholderData: isPersonsPlaceholderData,
	} = useQuery({
		queryKey: personRepository.getQueryKey(
			'persons',
			{
				page,
				limit: perPage,
			},
			selectLinkedType,
			selectCity,
			selectStatus,
			selectName,
			selectCPF,
		),
		queryFn: ({ signal }) =>
			personRepository.getAllPersons({
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

	const { mutateAsync: handleDeletePerson, isPending: isDeletePersonLoading } =
		useMutation({
			mutationFn: ({ id }: { id: number }) =>
				personRepository.deletePerson({ id }),
			onSettled: async () => {
				await queryClient.invalidateQueries({
					queryKey: personRepository.getQueryKey(
						'persons',
						{ page, limit: perPage },
						selectLinkedType,
						selectCity,
						selectStatus,
						selectName,
						selectCPF,
					),
				})
				selectCity.value = undefined
			},
			onError: (error, variables, context) => {
				notify.error(
					error,
					{ title: 'Erro ao apagar a pessoa!' },
					{ duration: 1500 },
				)
			},
			onSuccess: (data, variables, context) => {
				notify.success(
					{ title: `Pessoa apagada com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const { mutateAsync: handleUpdatePerson, isPending: isUpdatePersonLoading } =
		useMutation({
			mutationFn: (
				data: PersonModel,
			) => personRepository.updateTableValue(data),
			onSettled: async () => {
				return await queryClient.invalidateQueries({
					queryKey: personRepository.getQueryKey(
						'persons',
						{ page, limit: perPage },
						selectLinkedType,
						selectCity,
						selectStatus,
						selectName,
						selectCPF,
					),
				})
			},
			onError: (error, variables, context) => {
				notify.success(
					{ title: `Erro ao atualizar a pessoa!` },
					{ duration: 1500 },
				)
			},
			onSuccess: (data, variables, context) => {
				notify.success(
					{ title: `Pessoa atualizada com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const { mutateAsync: handleCreatePerson, isPending: isCreatePersonLoading } =
		useMutation({
			mutationFn: (data: PersonModel) => personRepository.personCreate(data),
			onSettled: async () => {
				await queryClient.invalidateQueries({
					queryKey: personRepository.getQueryKey(
						'persons',
						{ page, limit: perPage },
						selectLinkedType,
						selectCity,
						selectStatus,
						selectName,
						selectCPF,
					),
				})
				openCreateModal.value = false
			},
			onError: (error, variables, context) => {
				notify.success({ title: `Erro ao criar a pessoa!` }, { duration: 1500 })
			},
			onSuccess: (data, variables, context) => {
				notify.success(
					{ title: `Pessoa criada com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const formattedAllTypeOfOperator = computed<PersonTable[]>(() => {
		return (persons.value ?? []).map(
			({ id, name, cpf, linkedType, city, email, status }) => ({
				id: id as number,
				name,
				cpf: formatCPF(cpf),
				linkedType: linkedType as string,
				city: city as string,
				email: email  as string,
				status: status as number,
			}),
		)
	})

	const columns: ColumnDef<PersonTable>[] = [
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
			accessorKey: 'linkedType',
			meta: 'Tp. vinculo',
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
						'Tp. vinculo',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('name')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('linkedType')),
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
						disabled: formattedAllTypeOfOperator.value.length <= 0,
						// onClick: () => handleSort('name'),
					},
					() => [
						'Cidade',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('name')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('city')),
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
			accessorKey: 'status',
			meta: 'Status',
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
						'Status',
						// h(FontAwesomeIcon, {
						// 	class: 'ml-2 h-4 w-4 bh-text-black/20',
						// 	icon: ['fas', getSort('name')],
						// }),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('status')),
			enableHiding: false,
		},
		{
			id: 'actions',
			header: 'Ação',
			cell: ({ row }) => {
				const data = row.original
				return h('div', { class: 'relative max-w-4 flex gap-2' }, [
					h(EditTableRegisterPerson, {
						dataId: data.id,
						tablePersonName: data.name,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdatePersonLoading.value,
					}),
					h(DeleteTableRegisterPerson, {
						dataId: data.id,
						tablePersonName: data.name,
						'onOn-delete': onDeleteSubmit,
						isLoading: isDeletePersonLoading.value,
						isActive: data.status === 1,
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
		birthday: z.string({ message: 'Esse campo é obrigatório.' }),
		cpf: z.string({ message: 'Esse campo é obrigatório.' }),
		addresses: z
			.array(
				z.object({
					cityId: z.string({ message: 'Esse campo é obrigatório.' }),
					stateId: z.string({ message: 'Esse campo é obrigatório.' }),
					street: z.string({ message: 'Esse campo é obrigatório.' }),
					zipCode: z.string({ message: 'Esse campo é obrigatório.' }),
					addressTypeId: z.string({ message: 'Esse campo é obrigatório.' }),
				}),
				{ message: 'Deve haver pelo menos 1 endereço.' },
			)
			.min(1, 'Deve haver pelo menos 1 endereço.'),
		contacts: z
			.array(
				z.object({
					phoneTypeId: z.string({ message: 'Esse campo é obrigatório.' }),
					phone: z.string({ message: 'Esse campo é obrigatório.' }),
					email: z.string({ message: 'Esse campo é obrigatório.' }),
					cellphone: z.string({ message: 'Esse campo é obrigatório.' }),
				}),
				{ message: 'Deve haver pelo menos 1 contato.' },
			)
			.min(1, 'Deve haver pelo menos 1 contato.'),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
		initialValues: {
			contacts: [],
			addresses: [],
		},
	})

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreatePerson(
			new PersonModel({
				name: values.name,
				birthday: values.birthday,
				cpf: values.cpf,
				addresses: values.addresses.map((data) => new AddressModel(data)),
				deletedAddresses: [],
				contacts: values.contacts.map((data) => new ContactModel(data)),
				deletedContacts: [],
			}),
		)
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema> & {
			deletedAddresses: number[]
			deletedContacts: number[]
		},
	) => {
		return handleUpdatePerson(
			new PersonModel({
				id,
				name: values.name,
				birthday: values.birthday,
				cpf: values.cpf,
				addresses: values.addresses.map((data) => new AddressModel(data)),
				deletedAddresses: values.deletedAddresses,
				contacts: values.contacts.map((data) => new ContactModel(data)),
				deletedContacts: values.deletedContacts,
			}),
		)
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeletePerson({ id })
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
				selectPersonsRefetch()
				return
			}

			selectSort.value = undefined
			selectPersonsRefetch()
			return
		}

		selectSort.value = `[${key}][ASC]`
		selectPersonsRefetch()
	}

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isPersonsPlaceholderData.value) {
				page.value = to
			}
		}
	}

	function handleSelectCity() {
		selectPersonsRefetch()
	}

	function handleClear() {
		selectCity.value = undefined
		selectCPF.value = undefined
		selectName.value = undefined
		selectLinkedType.value = undefined
		selectStatus.value = undefined
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Pessoas']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex gap-10 items-center justify-center">
					<Titulo title="Gerenciar Tipos de Operadores" />

					<form-wrapper
						v-model="openCreateModal"
						:is-loading="isCreatePersonLoading"
						:title="`Criar uma nova pessoa`"
						description="Crie o conteúdo de uma nova pessoa."
						class="sm:max-w-[1100px]"
						@form-submit="onCreateSubmit"
					>
						<template #trigger>
							<tooltip-provider>
								<tooltip>
									<tooltip-trigger as-child>
										<button-root
											variant="ghost"
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
							<TableRegisterPersonForm
								:metadata="form.values"
								:disabled="isCreatePersonLoading"
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
					:is-loading="isPersonsLoading"
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
