<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';

// Componentes
import Vue3Datatable from '@bhplugin/vue3-datatable';
import Titulo from 'src/core/components/Titulo.vue';
import Breadcrumbs from 'src/core/components/Breadcrumbs.vue';
import Modal from 'src/core/components/Modal.vue';
import InputLabel from 'src/core/components/Inputs/InputLabel.vue';
import CadastrarPagina from 'src/modules/configuracoes/components/cadastrarPagina.vue';
import CadastrarComponentes from 'src/modules/configuracoes/components/cadastrarComponentes.vue';

// Ícones
import IconAdd from 'src/core/components/Icons/IconAdd.vue';
import IconDelete from 'src/core/components/Icons/IconDelete.vue';

// Declarações
const selected = reactive<{ type: string; label: string }>({
	type: '',
	label: '',
});

const instituicao = ref<string>('');
const tipo_instituicao = ref<string>('');
const isOpenDialog = ref<boolean>(false);
const isOpenComponente = ref<boolean>(false);
const selectedPageId = ref<number | null>(null); // ID da página selecionada
const selectedPageName = ref<string>('');        // Nome da página selecionada
const selectedPageComponents = ref<any[]>([]);   // Componentes da página selecionada

const cols = reactive([
	{ field: 'logo', title: 'Página', hide: false },
	{ field: 'instituicao', title: 'Instituição', hide: false },
	{ field: 'tipo_instituicao', title: 'Tipo de Instituição', hide: false },
	{ field: 'actions', title: 'Ação', hide: false },
]);

const rows = reactive([
	{
		id: '1',
		logo: '1',
		instituicao: 'Banco do Brasil',
		tipo_instituicao: 'Instituição Financeira',
	},
	{
		id: '2',
		logo: '1',
		instituicao: 'ASM - Associação Servidores de Macapá',
		tipo_instituicao: 'Associação de Servidores Públicos',
	},
]);

const filtered = (value: string = '') => {
	if (value === '') return rows;
	if (selected.type === 'instituicao')
		return rows.filter((item: any) => item.instituicao === value);
};

const pages = ref<any[]>([]);

const fetchPages = async () => {
	try {
		const authToken = localStorage.getItem('authToken');
		if (authToken) {
			const response = await axios.get('https://dev-02-apiv2.management.infoconsig.tec.br/api/paginas', {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			});
			pages.value = response.data.data;
		} else {
			console.error('Token não encontrado no storage.');
		}
	} catch (error) {
		console.error('Erro ao buscar dados das páginas:', error);
	}
};

// Executa a busca ao montar o componente
onMounted(fetchPages);

const openComponenteModal = (page: any) => {
	selectedPageId.value = page.id;
	selectedPageName.value = page.nome;  // Define o nome da página selecionada
	selectedPageComponents.value = page.componentes || [];
	isOpenComponente.value = true;
};
</script>

<template>
	<main>
		<breadcrumbs :paginas="['Configurações', 'Páginas']" />

		<div class="panel mt-6">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="flex items-center gap-14">
					<titulo title="Páginas" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right">Cadastre uma nova página</tippy>
				</div>

				<div class="header_actions flex items-center gap-2">
					<multiselect v-model="instituicao"
						:options="['Banco do Brasil', 'ASM - Associação Servidores de Macapá']"
						class="custom-multiselect min-w-[200px]" placeholder="Instituição" :searchable="false"
						:preselect-first="false" :allow-empty="false" selected-label="" select-label=""
						deselect-label="" @select="(selected.label = $event), (selected.type = 'instituicao')" />
					<multiselect v-model="tipo_instituicao"
						:options="['Instituição Financeira', 'Associação de Servidores Públicos']"
						class="custom-multiselect min-w-[150px]" placeholder="Tipo Instituição" :searchable="false"
						:preselect-first="false" :allow-empty="false" selected-label="" select-label=""
						deselect-label="" @select="(selected.label = $event), (selected.type = 'tipo_instituicao')" />
				</div>
			</div>

			<div class="datatable pb-1">
				<div class="table-responsive my-3">
					<table>
						<thead>
							<tr>
								<th>Páginas</th>
								<th>Slug</th>
								<th>Ações</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="page in pages" :key="page.id">
								<td>{{ page.nome }}</td>
								<td>{{ page.slug }}</td>
								<td>
									<button class="btn">Editar</button>
									<button @click="openComponenteModal(page)" class="btn">Ver</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</main>

	<modal :is-open="isOpenDialog" title="Adicionar Página" size="max-w-[650px]" @btn-close="isOpenDialog = false">
		<cadastrar-pagina :paginas="pages" @btn-cancelar="isOpenDialog = false" />
	</modal>

	<modal :is-open="isOpenComponente" :title="`Adicionar Componente - ${selectedPageName}`" size="max-w-[650px]"
		@btn-close="isOpenComponente = false">
		<cadastrar-componentes :page-id="selectedPageId" :componentes="selectedPageComponents"
			@btn-cancelar="isOpenComponente = false" />
	</modal>
</template>
