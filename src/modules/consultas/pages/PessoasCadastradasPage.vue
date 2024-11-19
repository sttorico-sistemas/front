<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import breadcrumbs from 'src/core/components/Breadcrumbs.vue';
import titulo from 'src/core/components/Titulo.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import ConsultasCadastroPessoa from '../components/CadastroPessoa/CadastroPessoa.vue';
import ConsultasExport from '../components/ConsultasExport.vue';
import IconAdd from 'src/core/components/Icons/IconAdd.vue';
import IconClear from 'src/core/components/Icons/IconClear.vue';
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue';
import IconEdit from 'src/core/components/Icons/IconEdit.vue';
import IconCheck from 'src/core/components/Icons/IconCheck.vue';
import IconBlock from 'src/core/components/Icons/IconBlock.vue';
import AppDialog from 'src/core/components/AppDialog.vue';
import AppButton from 'src/core/components/AppButton.vue';
import CircularProgress from 'src/core/components/CircularProgress.vue';
import { pessoaStore } from '../stores/pessoa.store';
import axios from 'axios';

// Store para gerenciar dados de pessoas
const store = pessoaStore();

// Controle dos campos de busca
const nome = ref('');
const cpf = ref('');
const tp_vinculo = ref('');
const cidade = ref('');
const status = ref('');

// Controle das colunas da tabela
const cols = reactive<Array<{ field: string; title: string; hide: boolean }>>([]);

// Função para limpar os filtros
const clearFilter = () => {
  nome.value = '';
  cpf.value = '';
  tp_vinculo.value = '';
  cidade.value = '';
  status.value = '';
};

// Função para mapear as cores do status
const color = (value: string): string => {
  switch (value) {
    case 'Ativo':
      return 'bg-success';
    case 'Inativo':
      return 'bg-warning';
    case 'Bloqueado':
      return 'bg-secondary';
    default:
      return 'bg-secondary';
	  
  }
};

// Função para carregar as permissões de colunas com base no operador logado
const fetchAccessibleColumns = async (): Promise<void> => {
  try {
    const authToken = localStorage.getItem('authToken');
    const operatorId = localStorage.getItem('operadorId');

    if (!authToken || !operatorId) {
      throw new Error('Token ou ID do operador não encontrado.');
    }

    // Requisição para buscar as permissões de colunas
    const response = await axios.get(
      'https://dev-02-apiv2.management.infoconsig.tec.br/api/accessible-columns',
      {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { operador_id: operatorId },
      }
    );

    // Configuração das colunas com base nas permissões
    cols.splice(
      0,
      cols.length,
      ...response.data.map((column: any) => ({
        field: column.slug,
        title: column.name,
        hide: false,
      }))
    );
  } catch (error) {
    console.error('Erro ao carregar colunas acessíveis:', error);
  }
};

// Carregar dados ao montar o componente
onMounted(async () => {
  await fetchAccessibleColumns();
  store.getAllPessoas();
});
</script>
<template>
	<main>
	  <breadcrumbs :paginas="['Consultas', 'Pessoas']" />
  
	  <div class="panel pb-0 mt-6">
		<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
		  <div class="flex items-center gap-14">
			<titulo title="Pessoas Cadastradas" />
			<button @click="store.toggleEditor(true)" v-tippy:right>
			  <icon-add />
			</button>
			<tippy target="right" placement="right">Cadastre uma nova pessoa</tippy>
		  </div>
  
		  <div class="header_actions flex flex-wrap md:flex-nowrap items-center gap-5">
			<multiselect v-model="nome" :options="['João', 'Maria']" placeholder="Nome" />
			<multiselect v-model="cpf" :options="['123.456.789-00', '987.654.321-00']" placeholder="CPF" />
			<multiselect v-model="tp_vinculo" :options="['Tipo 1', 'Tipo 2']" placeholder="Tipo Vínculo" />
			<multiselect v-model="cidade" :options="['Cidade 1', 'Cidade 2']" placeholder="Cidade" />
			<multiselect v-model="status" :options="['Ativo', 'Inativo']" placeholder="Status" />
  
			<button v-tippy:top @click="clearFilter">
			  <icon-clear />
			</button>
			<consultas-export :cols="cols" :rows="store.pessoas" filename="Relatório Pessoas">
			  <template #icon>
				<icon-printer />
			  </template>
			</consultas-export>
		  </div>
		</div>
  
		<vue3-datatable
		  :rows="store.pessoas"
		  :columns="cols"
		  :total-rows="store.total"
		  :sortable="true"
		  skin="whitespace-nowrap bh-table-striped"
		  no-data-content="Nenhum dado encontrado"
		  pagination-info="Mostrando {0} a {1} de {2} entradas"
		  :loading="store.loadingPessoas"
		  :page="store.pagina"
		  :page-size="store.limite"
		  @change="(e: any) => store.goToPage(e.current_page)"
		  @page-size-change="(e: number) => store.setLimit(e)"
		></vue3-datatable>
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
