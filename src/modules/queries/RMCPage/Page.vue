<script lang="ts" setup>
	import { computed, h, onMounted, ref, watch } from 'vue'
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
	import { InputRoot } from '@/core/components/fields/input'
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
		SelectRoot,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger,
		SelectValue,
	} from '@/core/components/fields/select'
	import { FormWrapper } from '@/core/components/form-wrapper'
	import {
		TableWrapper,
		TablePagination,
	} from '@/core/components/table-wrapper'
	import Breadcrumbs from 'src/core/components/Breadcrumbs.vue'
	import Titulo from 'src/core/components/Titulo.vue'
	import { auxiliaryRepository, personRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { AddressModel, ContactModel, PersonModel } from '@/core/models'
	import {
		cn,
		debounceAsync,
		formatCPF,
		formatStatus,
		generatePrint,
		StatusFormatted,
		valueUpdater,
	} from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import { RMCDeleteAction, RMCForm, RMCUpdateAction } from './components/table'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	type PersonTable = {
		id: number
		name: string
		cpf: string
		linkedType: string
		city: string
		email: string
		status: StatusFormatted
		statusId: number
	}

	const changeValues = {
		ASC: 'DESC',
		DESC: 'NONE',
		NONE: 'ASC',
	} as const

	const statusItems = [
		{ value: 1, label: 'Ativado' },
		{ value: 0, label: 'Desativado' },
	] as const

	const statusItemsMap: Record<number, string> = {
		1: 'Ativado',
		0: 'Desativado',
	}

	const openCityBox = ref(false)
	const openCreateModal = ref(false)
	const name = ref<string | undefined>(undefined)
	const cpf = ref<string | undefined>(undefined)
	const rowSelection = ref({})
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })
	const selectSort = useRouteQuery<string | undefined>('mtr-cgn-sort')
	const formattedSearchCities = useLocalStorage<{ id: string; name: string }[]>(
		'aux-sch-cities',
		[],
	)
	const selectLinkedType = useRouteQuery<string | undefined>(
		'prs-linked-type',
		undefined,
	)
	const selectCity = useRouteQuery<string | undefined>('prs-city', undefined)
	const selectName = useRouteQuery<string | undefined>('prs-name', undefined)
	const selectCPF = useRouteQuery<string | undefined>('prs-cpf', undefined)
	const selectStatus = useRouteQuery<string | undefined>(
		'prs-status',
		undefined,
	)
	const page = useRouteQuery('mtr-cgn-page', 1, { transform: Number })
	const perPage = useRouteQuery('mtr-cgn-per-page', 8, {
		transform: Number,
	})
	const queryClient = useQueryClient()
	const notify = useNotify()

	onMounted(() => {
		cpf.value = selectCPF.value
		name.value = selectName.value
	})

	const {
		data: persons,
		isLoading: isPersonsLoading,
		isPlaceholderData: isPersonsPlaceholderData,
	} = useQuery({
		enabled: false,
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
				params: {
					page: page.value,
					per_page: perPage.value,
					search: selectName.value,
					status: selectStatus.value,
					cpf: selectCPF.value,
					cidade_id: selectCity.value,
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

	const {
		mutateAsync: handleActivatePerson,
		isPending: isActivatePersonLoading,
	} = useMutation({
		mutationFn: ({ id }: { id: number }) =>
			personRepository.activatePerson({ id }),
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
				{ title: error.message ?? 'Erro ao atualizar status da pessoa!' },
				{ duration: 1500 },
			)
		},
		onSuccess: () => {
			notify.success(
				{ title: `Status da pessoa alterado com sucesso!` },
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
					{ title: error.message ?? `Erro ao atualizar a pessoa!` },
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
			},
			onError: (error) => {
				notify.error(
					error,
					{ title: error.message ?? `Erro ao criar a pessoa!` },
					{ duration: 1500 },
				)
			},
			onSuccess: () => {
				notify.success(
					{ title: `Pessoa criada com sucesso!` },
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
				status: formatStatus(status as number),
				statusId: status as number,
			}),
		)
	})

	const columns: ColumnDef<PersonTable>[] = [
		{
			accessorKey: 'name',
			meta: 'RMC',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPersons.value.length <= 0,
						onClick: () => handleSort('name'),
					},
					() => [
						'RMC',
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
			meta: 'Data',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPersons.value.length <= 0,
						onClick: () => handleSort('cpf'),
					},
					() => [
						'Data',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('cpf')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('cpf')),
			enableHiding: false,
		},
		{
			accessorKey: 'linkedType',
			meta: 'Tipo RMC',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPersons.value.length <= 0,
						onClick: () => handleSort('linkedType'),
					},
					() => [
						'Tipo RMC',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('linkedType')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('linkedType')),
			enableHiding: false,
		},
		{
			accessorKey: 'city',
			meta: 'Cód Autorização',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPersons.value.length <= 0,
						onClick: () => handleSort('city'),
					},
					() => [
						'Cód Autorização',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('city')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('city')),
			enableHiding: false,
		},
		{
			accessorKey: 'email',
			meta: 'Tipo Autorização',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPersons.value.length <= 0,
						onClick: () => handleSort('email'),
					},
					() => [
						'Tipo Autorização',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('email')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('email')),
			enableHiding: false,
		},
		{
			accessorKey: 'email',
			meta: 'Margem Reservada',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPersons.value.length <= 0,
						onClick: () => handleSort('email'),
					},
					() => [
						'Margem Reservada',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('email')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('email')),
			enableHiding: false,
		},
		{
			accessorKey: 'email',
			meta: 'Tipo Consignação',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPersons.value.length <= 0,
						onClick: () => handleSort('email'),
					},
					() => [
						'Tipo Consignação',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('email')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('email')),
			enableHiding: false,
		},
		{
			accessorKey: 'email',
			meta: 'Consignatária',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPersons.value.length <= 0,
						onClick: () => handleSort('email'),
					},
					() => [
						'Consignatária',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('email')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('email')),
			enableHiding: false,
		},
		{
			accessorKey: 'email',
			meta: 'Local Atendimento',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPersons.value.length <= 0,
						onClick: () => handleSort('email'),
					},
					() => [
						'Local Atendimento',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('email')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('email')),
			enableHiding: false,
		},
		{
			accessorKey: 'email',
			meta: 'Operador',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPersons.value.length <= 0,
						onClick: () => handleSort('email'),
					},
					() => [
						'Operador',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('email')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('email')),
			enableHiding: false,
		},
		{
			accessorKey: 'email',
			meta: 'Valor RMC',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPersons.value.length <= 0,
						onClick: () => handleSort('email'),
					},
					() => [
						'Valor RMC',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('email')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('email')),
			enableHiding: false,
		},
		{
			accessorKey: 'status',
			meta: 'Status',
			enableResizing: false,
			size: 0,
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllPersons.value.length <= 0,
						onClick: () => handleSort('status'),
					},
					() => [
						'Status',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('entityTypeId')],
						}),
					],
				)
			},
			cell: ({ row, cell }) =>
				h(
					'span',
					{
						class:
							'flex justify-center items-center max-w-20 rounded-md px-2 py-1 text-xs font-semibold',
						style: {
							color: row.getValue<StatusFormatted>('status').textColor,
							backgroundColor: row.getValue<StatusFormatted>('status').bgColor,
						},
					},
					row.getValue<StatusFormatted>('status')?.text,
				),
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
						h(RMCUpdateAction, {
							dataId: data.id,
							tablePersonName: data.name,
							'onOn-edit': onUpdateSubmit,
							isLoading: isUpdatePersonLoading.value,
							isActive: data.statusId === 1,
						}),
						h(RMCDeleteAction, {
							dataId: data.id,
							tablePersonName: data.name,
							'onOn-delete': onDeleteSubmit,
							isLoading: isActivatePersonLoading.value,
							isActive: data.statusId === 1,
						}),
					],
				)
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
		).then(() => {
			openCreateModal.value = false
		})
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema> & {
			deletedAddresses: number[]
			deletedContacts: number[]
		},
		onClose: () => void,
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
		).then(() => {
			return onClose()
		})
	}

	const onDeleteSubmit = async (id: number) => {
		return handleActivatePerson({ id })
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
			if (!isPersonsPlaceholderData.value) {
				page.value = to
			}
		}
	}

	function handleClear() {
		selectName.value = undefined
		name.value = undefined
		selectCPF.value = undefined
		cpf.value = undefined
		selectStatus.value = undefined
		selectCity.value = undefined
	}

	const handleSearch = debounceAsync(async (value: string | number) => {
		selectName.value = value.toString().trim()
	}, 500)

	const handleSearchCpf = debounceAsync(async (value: string | number) => {
		selectCPF.value = value.toString().trim().replace(/\D+/g, '')
	}, 500)

	const handleSearchCities = debounceAsync(async (value: string) => {
		return auxiliaryRepository
			.getAllCities({
				params: { search: value, perPage: 5 },
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
	<main>
		<breadcrumbs :paginas="['Cadastro', 'RMC']" />

		<div class="panel pb-4 mt-6">
			<div
				class="flex md:flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div
					class="flex flex-1 gap-14 items-center justify-between lg:justify-start lg:flex-initial"
				>
					<titulo title="Resumo da RMC - Reserva da Margem de Consignação" />
				</div>

				<div class="header_actions flex items-center gap-5 flex-1 justify-end">
					<select-root>
						<select-trigger class="max-w-60">
							<select-value
								class="text-left"
								placeholder="Tipo de consignação"
							/>
						</select-trigger>
						<select-content>
							<select-group>
								<select-label>Tipos de consignação:</select-label>
								<select-item
									v-for="statusItem of [] as any[]"
									:key="statusItem.value"
									:value="statusItem.value.toString()"
									>{{ statusItem.label }}</select-item
								>
							</select-group>
						</select-content>
					</select-root>

					<select-root>
						<select-trigger class="max-w-56">
							<select-value class="text-left" placeholder="Consignatária" />
						</select-trigger>
						<select-content>
							<select-group>
								<select-label>Consignatárias:</select-label>
								<select-item
									v-for="statusItem of [] as any[]"
									:key="statusItem.value"
									:value="statusItem.value.toString()"
									>{{ statusItem.label }}</select-item
								>
							</select-group>
						</select-content>
					</select-root>

					<select-root v-model="selectStatus">
						<select-trigger class="max-w-40">
							<select-value class="text-left" placeholder="Situação" />
						</select-trigger>
						<select-content>
							<select-group>
								<select-label>Situação:</select-label>
								<select-item
									v-for="statusItem of statusItems"
									:key="statusItem.value"
									:value="statusItem.value.toString()"
									>{{ statusItem.label }}</select-item
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
											data: formattedAllPersons,
											title: 'Gerenciar Pessoas Cadastradas',
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
					:is-loading="isPersonsLoading"
				/>

				<div :class="['flex w-full items-center justify-end px-4']">
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
