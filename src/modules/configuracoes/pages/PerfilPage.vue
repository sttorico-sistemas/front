<script lang="ts" setup>
	import { reactive, ref, onMounted, computed, h } from 'vue'
	import * as z from 'zod'
	import Modal from 'src/core/components/Modal.vue'
	import { useAxios, useNotify } from '@/core/composables'
	import { iamRepository } from '@/core/stores'
	import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
	import { PermissionModel, ProfileModel } from '@/core/models'
	import { ColumnDef, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
	import { ButtonRoot } from '@/core/components/button'
	import { valueUpdater } from '@/core/utils'
	import { useForm } from 'vee-validate'
	import { toTypedSchema } from '@vee-validate/zod'
	import Breadcrumbs from '@/core/components/Breadcrumbs.vue'
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger,
	} from '@/core/components/tooltip'
	import { FormWrapper } from '@/core/components/form-wrapper'
	import { TableWrapper } from '@/core/components/table-wrapper'
	import Titulo from '@/core/components/Titulo.vue'
	import TablePerfilForm from './components/perfil-table/TablePerfilForm.vue'
	import EditTablePerfil from './components/perfil-table/EditTablePerfil.vue'
	import DeleteTablePerfil from './components/perfil-table/DeleteTablePerfil.vue'

	type IAMTable = {
		id: number
		name: string
		description: string
		permissions: string
	}

	const changeValues = {
		ASC: 'DESC',
		DESC: 'NONE',
		NONE: 'ASC',
	} as const

	const openCreateModal = ref(false)
	const rowSelection = ref({})

	const { data: typeOfOperators, isLoading: isTypeOfOperatorsLoading } =
		useQuery({
			queryKey: iamRepository.getQueryKey('type-of-operators'),
			queryFn: ({ signal }) => iamRepository.getTypeOfOperators({ signal }),
		})

	const queryClient = useQueryClient()
	const notify = useNotify()

	const {
		mutateAsync: handleDeleteTypeOfOperator,
		isPending: isDeleteTypeOfOperatorLoading,
	} = useMutation({
		mutationFn: (data: Pick<ProfileModel, 'id'>) =>
			iamRepository.deleteTypeOfOperator(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: iamRepository.getQueryKey('type-of-operators'),
			})
		},
		onError: (error, variables, context) => {
			notify.error(
				error,
				{ title: 'Erro ao apagar tipo do operador!' },
				{ duration: 1500 },
			)
		},
		onSuccess: (data, variables, context) => {
			notify.success(
				{ title: `Tipo do operador apagado com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleUpdateTypeOfOperator,
		isPending: isUpdateTypeOfOperatorLoading,
	} = useMutation({
		mutationFn: (
			data: Pick<ProfileModel, 'id' | 'name' | 'description'> & {
				permissions: Pick<PermissionModel, 'id'>['id'][]
			},
		) => iamRepository.updateTypeOfOperator(data),
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: iamRepository.getQueryKey('type-of-operators'),
			})
		},
		onError: (error, variables, context) => {
			notify.error(
				error,
				{ title: 'Erro ao atualizar tipo do operador!' },
				{ duration: 1500 },
			)
		},
		onSuccess: (data, variables, context) => {
			notify.success(
				{ title: `Tipo do operador atualizada com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const {
		mutateAsync: handleCreateTypeOfOperator,
		isPending: isCreateTypeOfOperatorLoading,
	} = useMutation({
		mutationFn: (
			data: Pick<ProfileModel, 'name' | 'description'> & {
				permissions: Pick<PermissionModel, 'id'>['id'][]
			},
		) => iamRepository.createTypeOfOperator(data),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: iamRepository.getQueryKey('type-of-operators'),
			})
			openCreateModal.value = false
		},
		onError: (error, variables, context) => {
			notify.error(
				error,
				{ title: 'Erro ao cadastrar tipo do operador!' },
				{ duration: 1500 },
			)
		},
		onSuccess: (data, variables, context) => {
			notify.success(
				{ title: `Tipo do operador cadastrada com sucesso!` },
				{ duration: 1500 },
			)
		},
	})

	const formattedAllTypeOfOperator = computed(() => {
		return (typeOfOperators.value ?? []).map(
			({ id, name, description, permissions }) => ({
				id,
				name,
				description,
				permissions: permissions
					.map(({ relatedName }) => relatedName)
					.join(', '),
			}),
		)
	})

	const columns: ColumnDef<IAMTable>[] = [
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
						disabled: formattedAllTypeOfOperator.value.length <= 0,
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
						disabled: formattedAllTypeOfOperator.value.length <= 0,
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
			header: 'Ação',
			cell: ({ row }) => {
				const data = row.original
				return h('div', { class: 'relative max-w-8 flex w-full gap-2' }, [
					h(EditTablePerfil, {
						dataId: data.id,
						tablePerfilName: data.name,
						'onOn-edit': onUpdateSubmit,
						isLoading: isUpdateTypeOfOperatorLoading.value,
					}),
					h(DeleteTablePerfil, {
						dataId: data.id,
						tablePerfilName: data.name,
						'onOn-delete': onDeleteSubmit,
						isLoading: isDeleteTypeOfOperatorLoading.value,
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
		name: z.string({ message: 'Esse campo é obrigatório.' }),
		description: z.string({ message: 'Esse campo é obrigatório.' }),
		permissions: z.array(z.string({ message: 'Esse campo é obrigatório 2.' }), {
			message: 'Esse campo é obrigatório 3.',
		}),
	})

	const form = useForm({
		validationSchema: toTypedSchema(formSchema),
	})

	console.log(form.errors)

	const onCreateSubmit = form.handleSubmit(async (values) => {
		return handleCreateTypeOfOperator({
			...values,
			permissions: values.permissions.map(Number),
		}).then((response) => {
			openCreateModal.value = false
			return response
		})
	})

	const onUpdateSubmit = async (
		id: number,
		values: z.infer<typeof formSchema>,
		onClose: () => void,
	) => {
		return handleUpdateTypeOfOperator({
			id,
			...values,
			permissions: values.permissions.map(Number),
		}).then(() => {
			onClose()
		})
	}

	const onDeleteSubmit = async (id: number) => {
		return handleDeleteTypeOfOperator({ id })
	}
</script>

<template>
	<main>
		<Breadcrumbs :paginas="['Configurações', 'Perfil']" />

		<div class="panel mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex gap-10 items-center justify-center">
					<Titulo title="Gerenciar Tipos de Operadores" />

					<form-wrapper
						v-model="openCreateModal"
						:is-loading="isCreateTypeOfOperatorLoading"
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
												class="text-primary w-5 h-5"
												:icon="['fas', 'circle-plus']"
											/>
										</button-root>
									</tooltip-trigger>
									<tooltip-content side="right">
										<p>Cadastre um novo perfil</p>
									</tooltip-content>
								</tooltip>
							</tooltip-provider>
						</template>

						<template #fields>
							<TablePerfilForm
								:metadata="form.values"
								:disabled="isCreateTypeOfOperatorLoading"
							/>
						</template>
					</form-wrapper>
				</div>
			</div>

			<div class="datatable pb-1">
				<table-wrapper
					:table="table"
					:column-size="columns.length"
					:row-limit="formattedAllTypeOfOperator.length"
					:is-loading="isTypeOfOperatorsLoading"
				/>
			</div>
		</div>
	</main>
</template>

<style scoped>
	.table-auto th,
	.table-auto td {
		padding: 8px;
		border: 1px solid #ccc;
	}
	.btn-primary {
		background-color: #2563eb;
		color: white;
		padding: 8px 16px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	.btn-secondary {
		background-color: #d1d5db;
		color: #1f2937;
		padding: 8px 16px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	.btn-danger {
		background-color: #ef4444;
		color: white;
		padding: 8px 16px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
</style>
