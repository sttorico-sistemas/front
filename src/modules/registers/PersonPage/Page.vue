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
	import { personRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { AddressModel, ContactModel, PersonModel } from '@/core/models'
	import { formatCPF, valueUpdater } from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import {
		PersonDeleteAction,
		PersonForm,
		PersonUpdateAction,
	} from './components/table'

	type PersonTable = {
		id: number
		name: string
		cpf: string
		linkedType: string
		city: string
		email: string
		status: number
	}

	// const changeValues = {
	// 	ASC: 'DESC',
	// 	DESC: 'NONE',
	// 	NONE: 'ASC',
	// } as const

	const openCreateModal = ref(false)
	const openNameBox = ref(false)
	const openCPFBox = ref(false)
	const rowSelection = ref({})
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })
	const formattedSearchNames = useLocalStorage<{ id: number; name: string }[]>(
		'search-person-names',
		[],
	)
	const formattedSearchCPFs = useLocalStorage<{ id: number; name: string }[]>(
		'search-person-cpf',
		[],
	)
	// const selectSort = useRouteQuery<string | undefined>('mtr-cgn-sort')
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
	const page = useRouteQuery('mtr-cgn-page', 1, { transform: Number })
	const perPage = useRouteQuery('mtr-cgn-per-page', 8, {
		transform: Number,
	})
	const queryClient = useQueryClient()
	const notify = useNotify()

	const {
		data: persons,
		isLoading: isPersonsLoading,
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

	const { mutateAsync: handleDeletePerson, isPending: isDeletePersonLoading } =
		useMutation({
			mutationFn: ({ id }: { id: number }) =>
				personRepository.deletePerson({ id }),
			onSettled: async () => {
				await queryClient.invalidateQueries({
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
				})
			},
			onError: (error) => {
				notify.error(
					error,
					{ title: 'Erro ao apagar a pessoa!' },
					{ duration: 1500 },
				)
			},
			onSuccess: () => {
				notify.success(
					{ title: `Pessoa apagada com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const { mutateAsync: handleUpdatePerson, isPending: isUpdatePersonLoading } =
		useMutation({
			mutationFn: (data: PersonModel) => personRepository.updatePerson(data),
			onSettled: async () => {
				return await queryClient.invalidateQueries({
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
				})
			},
			onError: (error) => {
				notify.error(
					error,
					{ title: `Erro ao atualizar a pessoa!` },
					{ duration: 1500 },
				)
			},
			onSuccess: () => {
				notify.success(
					{ title: `Pessoa atualizada com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const { mutateAsync: handleCreatePerson, isPending: isCreatePersonLoading } =
		useMutation({
			mutationFn: (data: PersonModel) => personRepository.createPerson(data),
			onSettled: async () => {
				await queryClient.invalidateQueries({
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
				})
				openCreateModal.value = false
			},
			onError: (error) => {
				notify.error(
					error,
					{ title: `Erro ao criar a pessoa!` },
					{ duration: 1500 },
				)
			},
			onSuccess: () => {
				notify.success(
					{ title: `Consignante criado com sucesso!` },
					{ duration: 1500 },
				)
			},
		})

	const formattedAllPersons = computed<PersonTable[]>(() => {
		return (persons.value ?? []).map(
			({ id, name, cpf, linkedType, city, email, status }) => ({
				id: id as number,
				name,
				cpf: formatCPF(cpf),
				linkedType: linkedType as string,
				city: city as string,
				email: email as string,
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
						disabled: formattedAllPersons.value.length <= 0,
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
						disabled: formattedAllPersons.value.length <= 0,
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
						disabled: formattedAllPersons.value.length <= 0,
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
						disabled: formattedAllPersons.value.length <= 0,
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
						disabled: formattedAllPersons.value.length <= 0,
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
						disabled: formattedAllPersons.value.length <= 0,
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
						disabled: formattedAllPersons.value.length <= 0,
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
			header: 'Ações',
			cell: ({ row }) => {
				const data = row.original
				return h('div', { class: 'relative max-w-4 flex gap-2' }, [
					h(PersonUpdateAction, {
						dataId: data.id,
						tablePersonName: data.name,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdatePersonLoading.value,
					}),
					h(PersonDeleteAction, {
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
			return formattedAllPersons.value
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
		birthday: z
			.string({ message: 'O aniversário é obrigatório.' })
			.min(1, { message: 'O aniversário é obrigatório.' }),
		cpf: z
			.string({ message: 'O CPF é obrigatório.' })
			.min(1, { message: 'O CPF é obrigatório.' }),
		addresses: z
			.array(
				z.object({
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
				}),
				{ message: 'Deve haver pelo menos 1 endereço.' },
			)
			.min(1, 'Deve haver pelo menos 1 endereço.'),
		contacts: z
			.array(
				z.object({
					phoneTypeId: z
						.string({ message: 'O tipo é obrigatório.' })
						.min(1, { message: 'O tipo é obrigatório.' }),
					phone: z
						.string({ message: 'O telefone é obrigatório.' })
						.min(1, { message: 'O telefone é obrigatório.' }),
					email: z
						.string({ message: 'O e-mail é obrigatório.' })
						.min(1, { message: 'O e-mail é obrigatório.' }),
					cellphone: z
						.string({ message: 'O celular é obrigatório.' })
						.min(1, { message: 'O celular é obrigatório.' }),
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
	// 			selectPersonsRefetch()
	// 			return
	// 		}

	// 		selectSort.value = undefined
	// 		selectPersonsRefetch()
	// 		return
	// 	}

	// 	selectSort.value = `[${key}][ASC]`
	// 	selectPersonsRefetch()
	// }

	function handlePagination(to: number) {
		if (to < page.value) {
			page.value = Math.max(to, 1)
		} else if (to > page.value) {
			if (!isPersonsPlaceholderData.value) {
				page.value = to
			}
		}
	}
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Cadastro', 'Pessoas Cadastradas']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex gap-10 items-center justify-center">
					<titulo title="Gerenciar pessoas cadastradas" />

					<form-wrapper
						v-model="openCreateModal"
						:is-loading="isCreatePersonLoading"
						:title="`Criar um nova pessoa`"
						description="Crie o conteúdo de um nova pessoa."
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
										<p>Cadastre um nova pessoa</p>
									</tooltip-content>
								</tooltip>
							</tooltip-provider>
						</template>

						<template #fields>
							<person-form
								:metadata="form.values"
								:disabled="isCreatePersonLoading"
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
					:is-loading="isPersonsLoading"
				/>

				<div :class="['flex w-full items-center px-4']">
					<table-pagination
						v-model="page"
						:disabled="formattedAllPersons.length <= 0"
						:total-itens="pageMetadata.totalItens"
						:items-per-page="perPage"
						@update-paginate="handlePagination"
					/>
				</div>
			</div>
		</div>
	</main>
</template>
