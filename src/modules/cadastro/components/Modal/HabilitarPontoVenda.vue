<script lang="ts" setup>
import { reactive, ref } from 'vue'

// Componentes
import Vue3Datatable from '@bhplugin/vue3-datatable'
import titulo from '@/core/components/Titulo.vue'
import LabelInput from '@/core/components/Inputs/InputLabel.vue'

// Icones
import IconCheck from '@/core/components/Icons/IconCheck.vue'
import IconBlock from '@/core/components/Icons/IconBlock.vue'

// Declarações
const cols = reactive([
  { field: 'ponto_venda', title: 'Ponto de Venda', hide: false, sort: true, },
  { field: 'tipo_pdv', title: 'Tipo PDV', hide: false, sort: true, },
  { field: 'cidade', title: 'Cidade', hide: false, sort: true, },
  { field: 'status', title: 'Status', hide: false, sort: true, },
  { field: 'actions', title: 'Ações', hide: false, sort: false, },
])
const rows = reactive([
  {
    id: 1,
    ponto_venda: 'Agência Centro Florianópolis',
    tipo_pdv: 'Agência',
    cidade: 'Florianópolis-SC',
    status: 'Ativo',
  },
  {
    id: 2,
    ponto_venda: 'PAB - Prefeitura Florianópolis',
    tipo_pdv: 'PAB',
    cidade: 'Florianópolis-SC',
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
      <label-input id="cod_consignante" value="55.652" label="Cód. Consignante" class-label="text-[10px]"
        class-input="md:max-w-[100px] mb-3 text-xs font-normal disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
        class-wrapper="w-full md:min-w-[100px]" layout="row" disabled />
      <label-input id="cnpj" value="55.652.789/0001-01" label="CNPJ" class-label="text-[10px]"
        class-input="md:max-w-[177px] mb-3 text-xs font-normal disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
        class-wrapper="w-full md:min-w-[177px]" layout="row" disabled />
      <label-input id="consignante" value="Instituto de Previdência do Município de Almirante Tamandare"
        label="Consignante" class-label="text-[10px]"
        class-input="md:max-w-[420px] mb-3 text-xs font-normal disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
        class-wrapper="w-full md:min-w-[420px]" layout="row" disabled />
      <label-input id="tipo_entidade" value="Governo Municipal" label="Tipo de Entidade" class-label="text-[10px]"
        class-input="md:max-w-[245px] mb-3 text-xs font-normal disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
        class-wrapper="w-full md:min-w-[245px]" layout="row" disabled />
      <label-input id="consignante_master" value="Municipio Alm Tamandaré - PR" label="Consignante Master"
        class-label="text-[10px]"
        class-input="md:max-w-[245px] mb-3 text-xs font-normal disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
        class-wrapper="w-full md:min-w-[245px]" layout="row" disabled />
    </div>
  </div>

  <div class="panel mt-4">
    <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
      <titulo title="Dados do Ponto de Venda" />
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
          <button v-tippy:right type="button" class="text-xs m-1">
            <icon-check v-if="data.value.status === 'Ativo'" class="w-5 h-5 text-primary_3-table" />
            <icon-block v-else class="w-5 h-5 text-primary_3-table" />
          </button>
          <tippy target="right" placement="right">{{ data.value.status === 'Ativo' ? 'Inativar' : 'Ativar' }}</tippy>
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
