<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';

// Componentes
import Titulo from 'src/core/components/Titulo.vue';
import Breadcrumbs from 'src/core/components/Breadcrumbs.vue';
import Modal from 'src/core/components/Modal.vue';
import InputLabel from 'src/core/components/Inputs/InputLabel.vue';

// Ícones
import IconAdd from 'src/core/components/Icons/IconAdd.vue';
import { useAxios } from '@/core/composables';

// Controle de estado
const isOpenDialog = ref(false);
const isEditMode = ref(false);
const pages = ref<any[]>([]);
const httpClient = useAxios()
	// Lista de páginas para montar o select

const pageForm = reactive({
	id: null,
	name: '',
	slug: '',
	parent_id: null,
	url: '',
});

// Fetch de páginas do backend
const fetchPages = async () => {
	try {
		const response = await httpClient.get<any>('/organize/pages');

		pages.value = response.data;
		console.log('Páginas carregadas:', pages.value);
	} catch (error) {
		console.error('Erro ao buscar dados das páginas:', error);
	}
};

// Submeter formulário de página (adicionar ou editar)
const submitPage = async () => {
	try {
    const runtime = isEditMode.value ? httpClient.put : httpClient.post;
		const url = isEditMode.value
			? `/organize/pages/${pageForm.id}`
			: '/organize/pages';

		await runtime<any, any>(url, pageForm);

		await fetchPages(); // Atualiza a lista de páginas
		isOpenDialog.value = false;
		clearPageForm();
	} catch (error) {
		console.error('Erro ao salvar página:', error);
	}
};

// Abrir modal de edição com dados da página
const openEditPageModal = (page: any) => {
	console.log('Abrindo modal com dados:', page); // Log para verificar dados
	clearPageForm(); // Limpa qualquer dado residual no formulário
	isEditMode.value = true;
	isOpenDialog.value = true;



	pageForm.id = page.id || null;
	pageForm.name = page.name || '';
	pageForm.slug = page.slug || '';
	pageForm.parent_id = page.parent_id || null;
	pageForm.url = page.url || '';
	//console.log(pageForm.name);
};

// Limpar formulário de página
const clearPageForm = () => {
	pageForm.id = null;
	pageForm.name = '';
	pageForm.slug = '';
	pageForm.parent_id = null;
	pageForm.url = '';
};

// Inicializar componente
onMounted(fetchPages);
</script>

<template>
	<main>
		<breadcrumbs :paginas="['Configurações', 'Páginas']" />

		<div class="panel mt-6">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="flex items-center gap-14">
					<titulo title="Páginas" />
					<button @click="isOpenDialog = true; isEditMode = false; clearPageForm()"
						v-tippy="{ placement: 'right' }">
						<icon-add />
					</button>
					<tippy target="right" placement="right">Cadastre uma nova página</tippy>
				</div>
			</div>

			<div class="datatable pb-1">
				<div class="table-responsive my-3">
					<table>
						<thead>
							<tr>
								<th>Páginas</th>
								<th>Slug</th>
								<th>URL</th>
								<th>Ações</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="page in pages" :key="page.id">
								<td>{{ page.name }}</td>
								<td>{{ page.slug }}</td>
								<td>{{ page.url }}</td>
								<td>
									<button class="btn btn-primary" @click="openEditPageModal(page)">Editar</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- Modal para cadastrar ou editar página -->
		<modal :is-open="isOpenDialog" :title="isEditMode ? 'Editar Página' : 'Adicionar Página'" size="max-w-[650px]"
			@btn-close="isOpenDialog = false">
			<form @submit.prevent="submitPage">
				<input-label id="page-name" label="Nome da Página" v-model="pageForm.name" required
					classWrapper="w-full" classLabel="block text-sm font-medium text-gray-700 mb-1" classInput="input">
				</input-label>

				<input-label id="page-slug" label="Slug" v-model="pageForm.slug" required classWrapper="w-full"
					classLabel="block text-sm font-medium text-gray-700 mb-1" classInput="input">
				</input-label>

				<input-label id="page-url" label="URL" v-model="pageForm.url" required classWrapper="w-full"
					classLabel="block text-sm font-medium text-gray-700 mb-1" classInput="input">
				</input-label>


				<div class="form-group">
					<label for="parent-id">Página Pai</label>
					<select id="parent-id" v-model="pageForm.parent_id" class="form-select">
						<option value="">Nenhuma</option>
						<option v-for="page in pages" :key="page.id" :value="page.id">
							{{ page.name }}
						</option>
					</select>
				</div>

				<div class="flex justify-end mt-4">
					<button type="button" class="btn btn-secondary mr-2" @click="isOpenDialog = false">Cancelar</button>
					<button type="submit" class="btn btn-primary">Salvar</button>
				</div>
			</form>
		</modal>
	</main>
</template>
