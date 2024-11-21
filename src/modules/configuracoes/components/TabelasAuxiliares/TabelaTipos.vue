<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import Titulo from 'src/core/components/Titulo.vue'
import { useRouteQuery } from '@vueuse/router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import * as z from 'zod'
import Swal from "sweetalert2";

import { tabelasAuxiliaresRepository } from '@/modules/configuracoes/stores'
import { ColumnDef, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { TableWrapper, TablePagination } from '@/core/components/table-wrapper'
import { valueUpdater } from '@/core/utils'
import { ButtonRoot } from '@/core/components/button'
import { FormWrapper } from '@/core/components/form-wrapper'
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
import { DeleteTableType, EditTableType, TableTypeForm } from '@/modules/configuracoes/components/TabelasAuxiliares/type-table'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { TableValue } from '../../types'


type TypeTables = {
	id: number
	name: string
}

const changeValues = {
	ASC: 'DESC',
	DESC: 'NONE',
	NONE: 'ASC',
} as const

const openCreateModal = ref(false)
const rowSelection = ref({})
const page = useRouteQuery('type-page', 1, { transform: Number })
const perPage = useRouteQuery('type-per-page', 8, { transform: Number })
const selectType = useRouteQuery<string | undefined>('type-select', undefined)
const selectSort = useRouteQuery<string | undefined>('type-sort')
const pageMetadata = ref({
	totalPages: 1,
	totalItens: 0
})

const { data: allRawTypeTables } = useQuery({
	queryKey: tabelasAuxiliaresRepository.getQueryKey(),
	queryFn: ({ signal }) => tabelasAuxiliaresRepository.getAllTables({
		signal,
		metaCallback: (meta, response) => {
			if (response.length > 0 && !selectType.value) {
				selectType.value = response[0].id.toString()
			}
		}
	}),
})

const enabledSelectType = computed(() => !!selectType?.value)
const queryClient = useQueryClient()

const { mutateAsync: handleDeleteType, isPending: isDeleteTypeLoading } = useMutation({
	mutationFn: ({ tableUrl, valueId }: { tableUrl: string, valueId: number }) => tabelasAuxiliaresRepository.deleteTableValue(tableUrl, valueId),
	onSettled: async () => {
		return await queryClient.invalidateQueries({
			queryKey: tabelasAuxiliaresRepository.getQueryKey(selectType.value, { page: page.value, limit: perPage.value })
		})
	},
	onError: (error, variables, context) => {
		Swal.fire({
			icon: 'error',
			title: 'Erro ao deletar tipo!',
			showConfirmButton: false,
			timer: 1500,
		});
	},
	onSuccess: (data, variables, context) => {
		Swal.fire({
			icon: 'success',
			title: 'Tipo deletar co sucesso!',
			showConfirmButton: false,
			timer: 1500,
		});
	},
})

const { mutateAsync: handleUpdateType, isPending: isUpdateTypeLoading } = useMutation({
	mutationFn: (tableValue: TableValue) => tabelasAuxiliaresRepository.updateTableValue(tableValue),
	onSettled: async () => {
		return await queryClient.invalidateQueries({
			queryKey: tabelasAuxiliaresRepository.getQueryKey(selectType.value, { page: page.value, limit: perPage.value })
		})
	},
	onError: (error, variables, context) => {
		Swal.fire({
			icon: 'error',
			title: 'Erro ao atualizar tipo!',
			showConfirmButton: false,
			timer: 1500,
		});
	},
	onSuccess: (data, variables, context) => {
		Swal.fire({
			icon: 'success',
			title: 'Tipo atualizado com sucesso!',
			showConfirmButton: false,
			timer: 1500,
		});
	},
})


const { mutateAsync: handleCreateType, isPending: isCreateTypeLoading } = useMutation({
	mutationFn: (tableValue: Pick<TableValue, 'nome' | 'tableUrl'>) => tabelasAuxiliaresRepository.createTableValue(tableValue),
	onSettled: async () => {
		return await queryClient.invalidateQueries({
			queryKey: tabelasAuxiliaresRepository.getQueryKey(selectType.value, { page: page.value, limit: perPage.value })
		})
	},
	onError: (error, variables, context) => {
		Swal.fire({
			icon: 'error',
			title: 'Erro ao cadastrar tipo!',
			showConfirmButton: false,
			timer: 1500,
		});
	},
	onSuccess: (data, variables, context) => {
		Swal.fire({
			icon: 'success',
			title: 'Tipo cadastrado co sucesso!',
			showConfirmButton: false,
			timer: 1500,
		});
	},
})

const {
	data: selectTypeData,
	isPending: isSelectTypePending,
	isFetching: isSelectTypeFetching,
	refetch: selectTypeRefetch
} = useQuery({
	enabled: enabledSelectType,
	queryKey: tabelasAuxiliaresRepository.getQueryKey(selectType.value, { page: page.value, limit: perPage.value }),
	queryFn: ({ signal }) => tabelasAuxiliaresRepository.getAllTableValues(selectType.value, {
		params: { page: page.value, perPage: perPage.value },
		signal,
		metaCallback: (meta) => {
			pageMetadata.value = { totalItens: meta.total, totalPages: meta.last_page }
		}
	}),
})


const formattedAllTypeTable = computed(() => {
	return (allRawTypeTables.value ?? []).map(({ url, name }) => ({ id: url, name }))
})

const formattedSelectedType = computed(() => {
	return (selectTypeData.value ?? []).map(({ id, nome }) => ({ id, name: nome }))
})

const columns: ColumnDef<TypeTables>[] = [
	{
		accessorKey: 'id',
		meta: 'Código',
		header: () => {
			return h(
				ButtonRoot,
				{
					variant: 'ghost',
					class: 'w-full justify-start px-2 font-bold',
					disabled: formattedSelectedType.value.length <= 0,
					onClick: () => handleSort('id'),
				},
				() => ['Código', h(FontAwesomeIcon, { class: 'ml-2 h-4 w-4 bh-text-black/20', icon: ['fas', getSort('id')] })],
			)
		},
		cell: ({ row }) => h('div', row.getValue('id')),
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		meta: 'Descrição',
		header: () => {
			return h(
				ButtonRoot,
				{
					variant: 'ghost',
					class: 'w-full justify-start px-2 font-bold',
					disabled: formattedSelectedType.value.length <= 0,
					onClick: () => handleSort('name'),
				},
				() => ['Descrição', h(FontAwesomeIcon, { class: 'ml-2 h-4 w-4 bh-text-black/20', icon: ['fas', getSort('name')] })],
			)
		},
		cell: ({ row }) => h('div', row.getValue('name')),
		enableHiding: false,
	},
	{
		id: 'actions',
		header: 'Ação',
		cell: ({ row }) => {
			const data = row.original
			return h(
				'div',
				{ class: 'relative max-w-4 flex gap-2' },
				[
					h(EditTableType, { dataId: data.id, tableTypeName: data.name, "onOn-edit": onUpdateSubmit, isLoading: isUpdateTypeLoading.value }),
					h(DeleteTableType, { dataId: data.id, tableTypeName: data.name, "onOn-delete": onDeleteSubimit, isLoading: isDeleteTypeLoading.value })
				]
			)
		},
	}
]

const table = useVueTable({
	get data() { return formattedSelectedType.value },
	get columns() { return columns },
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

const formSchema = z
	.object({
		name: z.string({ message: 'Esse campo é obrigatório.' }),
	})

const form = useForm({
	validationSchema: toTypedSchema(formSchema),
})

const onCreateSubmit = form.handleSubmit(async (values) => {
	return handleCreateType({
		nome: values.name,
		tableUrl: selectType.value,
	})
})

const onUpdateSubmit = async (id: number, values: z.infer<typeof formSchema>) => {
	return handleUpdateType({
		id,
		nome: values.name,
		tableUrl: selectType.value,
	})
}

const onDeleteSubimit = async (id: number) => {
	if (!selectType.value) return
	return handleDeleteType({ tableUrl: selectType.value, valueId: id })
}

function getSort(key: string) {
	const sortParameters = extractSort(selectSort.value as string)

	switch (sortParameters?.[key]) {
		case 'ASC': { return 'sort-up' }
		case 'DESC': { return 'sort-down' }
		default: { return 'sort' }
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
			selectTypeRefetch()
			return
		}

		selectSort.value = undefined
		selectTypeRefetch()
		return
	}

	selectSort.value = `[${key}][ASC]`
	selectTypeRefetch()
}

function handlePagination(to: number) {
	page.value = to
	selectTypeRefetch()
}

function handleSelectType() {
	selectTypeRefetch()
}
</script>

<template>
	<div class="panel mt-6">
		<div class="flex flex-wrap justify-between lg:items-center lg:flex-row flex-col mb-5 gap-5">
			<div class="flex gap-10 items-center justify-center">
				<titulo title="Cadastro de Tipos" />

				<form-wrapper v-model="openCreateModal" :is-loading="isCreateTypeLoading" :title="`Criar novo tipo`"
					description="Crie o conteúdo do novo tipo." class="sm:max-w-[780px]" @form-submit="onCreateSubmit">

					<template #trigger>
						<tooltip-provider>
							<tooltip>
								<tooltip-trigger as-child>
									<button-root variant="ghost" @click="openCreateModal = true">
										<font-awesome-icon class="text-primary_3-table w-5 h-5" :icon="['fas', 'circle-plus']" />
									</button-root>
								</tooltip-trigger>
								<tooltip-content side="right">
									<p>Cadastre um nova tablea auxiliar</p>
								</tooltip-content>
							</tooltip>
						</tooltip-provider>
					</template>

					<template #fields>
						<TableTypeForm :metadata="form.values" :disabled="isCreateTypeLoading" />
					</template>
				</form-wrapper>
			</div>

			<div class="header_actions flex items-center gap-20 flex-1 justify-end">
				<select-root :disabled="formattedAllTypeTable.length <= 0" v-model:model-value="selectType"
					@update:model-value="handleSelectType">
					<select-trigger class="lg:max-w-96 w-full">
						<select-value class="text-left" placeholder="Selecione a categoria..." />
					</select-trigger>
					<select-content>
						<select-group>
							<select-label>Categorias:</select-label>
							<select-item v-for="category of formattedAllTypeTable" :key="category.id"
								:value="category.id.toString()">{{
									category.name }}</select-item>
						</select-group>
					</select-content>
				</select-root>
			</div>
		</div>

		<div class="datatable pb-1">
			<table-wrapper :table="table" :column-size="columns.length" :row-limit="perPage"
				:is-loading="isSelectTypePending || isSelectTypeFetching" />

			<div :class="['flex w-full items-center px-4']">
				<div class="flex-1 text-sm text-muted-foreground">
					<!-- {{ formattedAllTypeTable.length }} de {{ pageMetadata.totalItens }} linha(s)
					selecionadas. -->
				</div>

				<TablePagination v-model="page" :disabled="formattedSelectedType.length <= 0"
					:total-itens="pageMetadata.totalItens" :items-per-page="perPage" @update-paginate="handlePagination" />
			</div>
		</div>
	</div>
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