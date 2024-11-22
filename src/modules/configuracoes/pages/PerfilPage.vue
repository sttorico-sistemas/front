<script lang="ts" setup>
	import { reactive, ref, onMounted } from 'vue'
	import axios from 'axios'
	import Modal from 'src/core/components/Modal.vue'
	import { useAxios } from '@/core/composables'

	// Estados e referências
	const tipoOperadores = ref<any[]>([])
	const permissions = ref<any[]>([])
	const isDialogOpen = ref<boolean>(false)
	const isEditMode = ref<boolean>(false)

	// Formulário reativo para tipo_operador
	const form = reactive({
		id: null,
		name: '',
		description: '',
		permissions: [] as number[],
	})

	const httpClient = useAxios()

	// Função para buscar tipos de operadores e permissões
	const fetchData = async () => {
		try {
			const [tipoOperadoresRes, permissionsRes] = await Promise.all([
				httpClient.get<any>('/profile/tipo-operador'),
				httpClient.get<any>('/profile/permissions'),
			])

			tipoOperadores.value = tipoOperadoresRes.data
			permissions.value = permissionsRes.data // Utilizando diretamente o related_name do backend
		} catch (error) {
			console.error('Erro ao buscar dados:', error)
		}
	}

	// Função para salvar ou editar tipo de operador
	const saveTipoOperador = async () => {
		try {
			const url = form.id
				? `/profile/tipo-operador/${form.id}`
				: '/profile/tipo-operador'

			const runtime = form.id ? httpClient.put : httpClient.post

			await runtime<any, any>(url, form)

			await fetchData()
			closeDialog()
		} catch (error) {
			console.error('Erro ao salvar tipo de operador:', error)
		}
	}

	// Função para abrir o modal em modo de edição
	const openEditModal = (tipoOperador: any) => {
		isEditMode.value = true
		isDialogOpen.value = true

		form.id = tipoOperador.id
		form.name = tipoOperador.name
		form.description = tipoOperador.description
		form.permissions = tipoOperador.permissions.map((p: any) => p.id)
	}

	// Função para fechar o modal e limpar o formulário
	const closeDialog = () => {
		isDialogOpen.value = false
		isEditMode.value = false
		clearForm()
	}

	// Função para limpar o formulário
	const clearForm = () => {
		form.id = null
		form.name = ''
		form.description = ''
		form.permissions = []
	}

	onMounted(fetchData)
</script>

<template>
	<main>
		<div class="flex justify-between items-center mb-4">
			<h1 class="text-2xl font-bold">Gerenciar Tipos de Operadores</h1>
			<button
				class="btn-primary"
				@click="
					() => {
						isDialogOpen = true
						isEditMode = false
						clearForm()
					}
				"
			>
				Adicionar Tipo Operador
			</button>
		</div>

		<table class="table-auto w-full border-collapse">
			<thead>
				<tr>
					<th class="text-left border-b p-2">Nome</th>
					<th class="text-left border-b p-2">Descrição</th>
					<th class="text-left border-b p-2">Permissões</th>
					<th class="text-left border-b p-2">Ações</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="tipoOperador in tipoOperadores" :key="tipoOperador.id">
					<td class="p-2 border-b">{{ tipoOperador.name }}</td>
					<td class="p-2 border-b">{{ tipoOperador.description }}</td>
					<td class="p-2 border-b">
						{{
							tipoOperador.permissions
								?.map((p) => p.related_name || 'Nome não definido') // Valor padrão se `related_name` estiver vazio
								.join(', ') || 'Sem permissões atribuídas'
						}}
					</td>
					<td class="p-2 border-b">
						<button
							class="btn-secondary mr-2"
							@click="openEditModal(tipoOperador)"
						>
							Editar
						</button>
						<button class="btn-danger">Excluir</button>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Modal para adicionar/editar tipo operador -->
		<modal
			:is-open="isDialogOpen"
			:title="isEditMode ? 'Editar Tipo Operador' : 'Adicionar Tipo Operador'"
			@close="closeDialog"
		>
			<form @submit.prevent="saveTipoOperador">
				<div class="mb-4">
					<label class="block text-sm font-medium mb-1">Nome</label>
					<input v-model="form.name" type="text" class="input" required />
				</div>

				<div class="mb-4">
					<label class="block text-sm font-medium mb-1">Descrição</label>
					<textarea v-model="form.description" class="input"></textarea>
				</div>

				<div class="mb-4">
					<label class="block text-sm font-medium mb-1">Permissões</label>
					<div
						v-for="permission in permissions"
						:key="permission.id"
						class="flex items-center mb-2"
					>
						<input
							type="checkbox"
							:value="permission.id"
							v-model="form.permissions"
						/>
						<span class="ml-2">{{ permission.related_name }}</span>
					</div>
				</div>

				<div class="flex justify-end">
					<button type="button" class="btn-secondary mr-2" @click="closeDialog">
						Cancelar
					</button>
					<button type="submit" class="btn-primary">Salvar</button>
				</div>
			</form>
		</modal>
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
