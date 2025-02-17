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
	import { auxiliaryRepository, logRepository } from '@/core/stores'
	import { useNotify } from '@/core/composables'
	import { AddressModel, LogModel } from '@/core/models'
	import {
		formatPhone,
		formatStatus,
		valueUpdater,
		type StatusFormatted,
	} from '@/core/utils'
	import { ButtonRoot } from '@/core/components/button'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	type LogTable = {
		id: number
		componentName: string
		operatorName: string
		operatorUsername: string
		type: string
		ip: string
	}

	const statusItems = [
		{ value: 1, label: 'Ativado' },
		{ value: 0, label: 'Desativado' },
	] as const

	const changeValues = {
		ASC: 'DESC',
		DESC: 'NONE',
		NONE: 'ASC',
	} as const

	const openCreateModal = ref(false)
	const rowSelection = ref({})
	const pageMetadata = ref({ totalPages: 1, totalItens: 0 })
	const selectSort = useRouteQuery<string | undefined>('cgn-sort')
	const status = useRouteQuery<string | undefined>('cgn-status', undefined)
	const page = useRouteQuery('cgn-page', 1, { transform: Number })
	const perPage = useRouteQuery('cgn-per-page', 8, {
		transform: Number,
	})
	const queryClient = useQueryClient()
	const notify = useNotify()

	const {
		data: logs,
		isLoading: isLogsLoading,
		isPlaceholderData: isLogsPlaceholderData,
	} = useQuery({
		queryKey: logRepository.getQueryKey(
			'logs',
			{
				page,
				limit: perPage,
			},
			status,
		),
		queryFn: ({ signal }) =>
			logRepository.getAllLogs({
				signal,
				params: {
					page: page.value,
					per_page: perPage.value,
					status: status.value,
				},
			}),
		placeholderData: keepPreviousData,
	})

	const formattedAllTypeOfLog = computed<LogTable[]>(() => {
		return (logs.value ?? []).map(
			({
				id,
				componentName,
				ip,
				operatorName,
				operatorUsername,
				createdAt,
				type,
			}) => ({
				id: id as number,
				componentName,
				operatorName,
				type,
				operatorUsername,
				createdAt,
				ip,
			}),
		)
	})

	const columns: ColumnDef<LogTable>[] = [
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
						disabled: formattedAllTypeOfLog.value.length <= 0,
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
			accessorKey: 'createdAt',
			meta: 'Data/Hora',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfLog.value.length <= 0,
						onClick: () => handleSort('createdAt'),
					},
					() => [
						'Data/Hora',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('createdAt')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('createdAt')),
			enableHiding: false,
		},
		{
			accessorKey: 'type',
			meta: 'Tipo de ação',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfLog.value.length <= 0,
						onClick: () => handleSort('type'),
					},
					() => [
						'Tipo de ação',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('type')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('type')),
			enableHiding: false,
		},
		{
			accessorKey: 'componentName',
			meta: 'Componente',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfLog.value.length <= 0,
						onClick: () => handleSort('componentName'),
					},
					() => [
						'Componente',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('componentName')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('componentName')),
			enableHiding: false,
		},
		{
			accessorKey: 'operatorUsername',
			meta: 'Operador',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfLog.value.length <= 0,
						onClick: () => handleSort('operatorUsername'),
					},
					() => [
						'Operador',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('operatorUsername')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('operatorUsername')),
			enableHiding: false,
		},
		{
			accessorKey: 'operatorName',
			meta: 'Nome',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfLog.value.length <= 0,
						onClick: () => handleSort('operatorName'),
					},
					() => [
						'Nome',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('operatorName')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('operatorName')),
			enableHiding: false,
		},
		{
			accessorKey: 'ip',
			meta: 'Endereço de IP',
			header: () => {
				return h(
					ButtonRoot,
					{
						variant: 'ghost',
						size: 'none',
						class: ['justify-start font-bold'],
						disabled: formattedAllTypeOfLog.value.length <= 0,
						onClick: () => handleSort('ip'),
					},
					() => [
						'Endereço de IP',
						h(FontAwesomeIcon, {
							class: 'ml-2 h-4 w-4 bh-text-black/20',
							icon: ['fas', getSort('ip')],
						}),
					],
				)
			},
			cell: ({ row }) => h('div', row.getValue('ip')),
			enableHiding: false,
		},
	]

	const table = useVueTable({
		get data() {
			return formattedAllTypeOfLog.value
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
		managerId: z
			.string({ message: 'O gestor é obrigatório' })
			.min(1, { message: 'O gestor é obrigatório.' }),
		phone: z
			.string({ message: 'O telefone é obrigatório.' })
			.min(1, { message: 'O telefone é obrigatório.' }),
		cellphone: z
			.string({ message: 'O celular é obrigatório' })
			.min(1, { message: 'O celular é obrigatório.' }),
		email: z
			.string({ message: 'O e-mail é obrigatório' })
			.email({ message: 'O e-mail tem que ser válido.' })
			.min(1, { message: 'O e-mail é obrigatório.' }),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
	})

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
			if (!isLogsPlaceholderData.value) {
				page.value = to
			}
		}
	}

	function handleClear() {
		status.value = undefined
	}
</script>

<template>
	<div class="flex flex-col gap-y-4">
		<div class="mb-4 flex gap-10 items-center">
			<div class="flex gap-14 items-center justify-center">
				<titulo title="Logs de Alterações" />
			</div>
		</div>

		<div class="pb-1">
			<table-wrapper
				:table="table"
				:column-size="columns.length"
				:row-limit="perPage"
				:is-loading="isLogsLoading"
			/>

			<div :class="['flex w-full items-center justify-end px-4']">
				<table-pagination
					v-model="page"
					:disabled="formattedAllTypeOfLog.length <= 0"
					:total-itens="pageMetadata.totalItens"
					:items-per-page="perPage"
					@update-paginate="handlePagination"
				/>
			</div>
		</div>
	</div>
</template>
