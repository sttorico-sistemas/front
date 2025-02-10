<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Operadores']" />
		<div class="panel mt-6">
			<titulo title="Gerenciar Operadores" />

			<!-- Botão para abrir modal -->
			<div class="flex justify-end mt-4">
				<button @click="openModal(null)" class="btn bg-primary text-white text-xs">
					Novo Operador
				</button>
			</div>

			<!-- Tabela de Operadores -->
			<div class="mt-4">
				<table class="w-full border-collapse shadow-md rounded-md">
					<thead>
						<tr>
							<th class="text-left p-2 border-b">Nome</th>
							<th class="text-left p-2 border-b">E-mail</th>
							<th class="text-left p-2 border-b">Tipo Operador</th>
							<th class="text-left p-2 border-b">Ações</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="operador in operadores" :key="operador.id">
							<td class="p-2 border-b">{{ operador.user.nome }}</td>
							<td class="p-2 border-b">{{ operador.user.email }}</td>
							<td class="p-2 border-b">{{ operador.tipo_operador.name }}</td>
							<td class="p-2 border-b">
								<!-- Botão Editar -->
								<button
									@click="openModal(operador)"
									class="btn text-xs bg-blue-500 text-white"
								>
									Editar
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Modal de Criar/Editar Operador -->
			<ModalOperador
				v-if="showModal"
				:operador="selectedOperador"
				@close="closeModal"
				@refresh="fetchOperadores"
			/>
		</div>
	</main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import breadcrumbs from 'src/core/components/Breadcrumbs.vue';
import titulo from 'src/core/components/Titulo.vue';
import ModalOperador from './ModalOperador.vue';

// Estados
const operadores = ref([]); // Lista de operadores
const showModal = ref(false); // Controle do modal de operador
const selectedOperador = ref(null); // Operador selecionado (para edição)

// Função para buscar operadores
const fetchOperadores = async () => {
	try {
		const response = await axios.get(
			'https://dev-02-apiv2.management.infoconsig.tec.br/api/profile/operador'
		);
		operadores.value = response.data.data; // Preenche a lista de operadores
	} catch (error) {
		console.error('Erro ao buscar operadores:', error);
	}
};

// Abrir modal de criação/edição
const openModal = (operador) => {
	selectedOperador.value = operador; // Define o operador selecionado (ou null para novo)
	showModal.value = true; // Exibe o modal
};

// Fechar modal de criação/edição
const closeModal = () => {
	showModal.value = false; // Esconde o modal
	selectedOperador.value = null; // Reseta o operador selecionado
};

// Inicializa a busca de operadores ao montar o componente
onMounted(fetchOperadores);
</script>
