<script lang="ts" setup>
import { reactive, ref } from 'vue'

// Componentes
import Vue3Datatable from '@bhplugin/vue3-datatable'
import titulo from '@/core/components/layout/tituloLayout.vue'
import LabelInput from '@/core/components/layout/forms/inputs/inputLabel.vue'
import inputReadOnly from '@/core/components/layout/forms/inputs/inputReadonly.vue'

// Icones
import IconCheck from '@/core/components/icons/iconCheck.vue'
import IconBlock from '@/core/components/icons/iconBlock.vue'
import IconEdit from '@/core/components/icons/iconEdit.vue'

// Declarações
const cols = reactive([
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

// Scripts
const emits = defineEmits(['btnSave', 'btnCancelar'])

const color = (value: string): string => {
  switch (value) {
    case 'Ativo':
      return 'bg-success' // Ativo
    case 'Liberada':
      return 'bg-success'
    case 'Inativo':
      return 'bg-warning' // Inativo
    case 'Bloqueada':
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
        pagination-info="Mostrando {0} a {1} de {2} entradas">
        <template #status="data">
          <span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.status)">{{
            data.value.status }}</span>
        </template>
        <template #actions="data">
          <div class="flex">
            <div>
              <button v-tippy:right type="button" class="text-xs m-1">
                <icon-edit class="w-5 h-5 text-primary_3-table" />
              </button>
              <tippy target="right" placement="right">Editar</tippy>
            </div>
            <div>
              <button v-tippy:right type="button" class="text-xs m-1">
                <icon-check v-if="data.value.status === 'Ativo'" class="w-5 h-5 text-primary_3-table" />
                <icon-block v-else class="w-5 h-5 text-primary_3-table" />
              </button>
              <tippy target="right" placement="right">{{ data.value.status === 'Ativo' ? 'Inativar' : 'Ativar' }}
              </tippy>
            </div>
          </div>
        </template>
      </vue3-datatable>
    </div>
    <div class="flex justify-center items-center gap-12 mt-8">
      <button type="button" class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
        @click="emits('btnCancelar', false)">Cancelar</button>
      <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs">Salvar</button>
    </div>
  </div>
</template>
