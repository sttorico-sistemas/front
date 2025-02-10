<script lang="ts" setup>
import { reactive } from 'vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import titulo from 'src/core/components/Titulo.vue'
import LabelInput from 'src/core/components/Inputs/InputLabel.vue'
import IconCheck from 'src/core/components/Icons/IconCheck.vue'
import IconBlock from 'src/core/components/Icons/IconBlock.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import { Col } from 'types/col.d'

const cols = reactive<Col[]>([
  { field: 'gestor', title: 'Gestores', hide: false, sort: true, },
  { field: 'atribuicao', title: 'Atribuição', hide: false, sort: true, },
  { field: 'cargo', title: 'Cargo', hide: false, sort: true, },
  { field: 'telefone', title: 'Telefone', hide: false, sort: true, },
  { field: 'celular', title: 'Celular', hide: false, sort: true, },
  { field: 'email', title: 'E-mail', hide: false, sort: true, },
  { field: 'status', title: 'Status', hide: false, sort: true, },
  { field: 'actions', title: 'Ações', hide: false, sort: false, },
])
const rows = reactive([
  {
    id: 1,
    gestor: 'João Carlos de Oliveira Carvalho',
    atribuicao: 'Contratos',
    cargo: 'Superintendente Regional',
    telefone: '(47) 3322-4455',
    celular: '(47) 9991-4455',
    email: 'financas@prefeitura.sc.gov.br',
    status: 'Ativo',
  },
  {
    id: 2,
    gestor: 'Mário José da Silva Chavier',
    atribuicao: 'Pontos de Vendas',
    cargo: 'Diretor Consignados',
    telefone: '(47) 3322-4455',
    celular: '(47) 9991-4455',
    email: 'gabinete@prefeitura.sc.gov.br',
    status: 'Inativo',
  },
])

const emits = defineEmits(['btnSave', 'btnCancelar'])

const color = (value: string): string => {
  switch (value) {
    case 'Ativo':
      return 'bg-success'
    case 'Liberada':
      return 'bg-success'
    case 'Inativo':
      return 'bg-warning'
    case 'Bloqueada':
      return 'bg-secondary'
    default:
      return 'bg-secondary'
  }
}
</script>
<template>
  <div class="panel">
    <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
      <titulo title="Dados do Consignante" />
    </div>

    <div class="flex justify-center items-center gap-2 flex-wrap md:flex-nowrap">
      <label-input id="nome" value="Backoffice Brasilia" label="Nome" class-label="text-[10px]"
        class-input="md:max-w-[400px] mb-3 text-xs font-normal disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
        class-wrapper="w-full md:min-w-[400px]" layout="row" disabled />
      <label-input id="setor" value="Aprovação de Contratos" label="Setor" class-label="text-[10px]"
        class-input="md:max-w-[300px] mb-3 text-xs font-normal disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
        class-wrapper="w-full md:min-w-[300px]" layout="row" disabled />
      <label-input id="cidade" value="Brasília" label="Cidade" class-label="text-[10px]"
        class-input="md:max-w-[300px] mb-3 text-xs font-normal disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
        class-wrapper="w-full md:min-w-[300px]" layout="row" disabled />
      <label-input id="uf" value="DF" label="UF" class-label="text-[10px]"
        class-input="md:max-w-[50px] mb-3 text-xs font-normal disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
        class-wrapper="w-full md:min-w-[50px]" layout="row" disabled />
    </div>
    <div class="flex justify-center items-center gap-2 flex-wrap md:flex-nowrap">
      <label-input id="gestor" label="Gestor" class-label="text-[10px]" class-input="md:max-w-[400px] mb-3"
        class-wrapper="w-full md:max-w-[400px]" layout="row" />
      <label-input type="tel" id="telefone" label="Telefone" class-label="text-[10px]"
        class-input="md:max-w-[150px] mb-3" class-wrapper="w-full md:max-w-[150px]" layout="row" />
      <label-input type="cel" id="celular" label="Celular" class-label="text-[10px]" class-input="md:max-w-[400px] mb-3"
        class-wrapper="w-full md:max-w-[400px]" layout="row" />
      <label-input type="email" id="email" label="E-mail" class-label="text-[10px]" class-input="md:max-w-[400px] mb-3"
        class-wrapper="w-full md:max-w-[400px]" layout="row" />
    </div>
  </div>

  <div class="panel mt-4">
    <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
      <titulo title="Backoffice" />
    </div>
    <div class="datatable">
      <vue3-datatable :rows="rows" :columns="cols" :total-rows="rows.length" :sortable="true"
        skin="whitespace-nowrap bh-table-striped" no-data-content="Nenhum dado foi encontrado"
        pagination-primary="Mostrando {0} a {1} de {2} entradas">
        <template #status="data">
          <span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.status)">{{
            data.value.status }}</span>
        </template>
        <template #actions="data">
          <div class="flex">
            <div>
              <button v-tippy:right type="button" class="text-xs m-1">
                <icon-edit class="w-5 h-5 text-primary" />
              </button>
              <tippy target="right" placement="right">Editar</tippy>
            </div>
            <div>
              <button v-tippy:right type="button" class="text-xs m-1">
                <icon-check v-if="data.value.status === 'Ativo'" class="w-5 h-5 text-primary" />
                <icon-block v-else class="w-5 h-5 text-primary" />
              </button>
              <tippy target="right" placement="right">{{ data.value.status === 'Ativo' ? 'Inativar' : 'Ativar' }}
              </tippy>
            </div>
          </div>
        </template>
      </vue3-datatable>
    </div>
    <div class="flex justify-center items-center gap-12 mt-8">
      <button type="button" class="w-[86px] btn border border-primary shadow-none text-primary text-xs"
        @click="emits('btnCancelar', false)">Cancelar</button>
      <button type="button" class="w-[86px] btn bg-primary text-white text-xs">Salvar</button>
    </div>
  </div>
</template>
