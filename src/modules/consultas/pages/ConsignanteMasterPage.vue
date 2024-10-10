<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { reactive, ref } from 'vue'
import breadcrumbs from 'src/core/components/Breadcrumbs.vue'
import titulo from 'src/core/components/Titulo.vue'
import modalLayout from 'src/core/components/Modal.vue'
import ConsultasExport from '../components/ConsultasExport.vue'
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue'
import { Col } from 'types/col.d'

const selected = reactive({
  type: '',
  label: '',
})
const isOpenDialog = ref(false)
const consignante = ref('')
const cols = reactive<Col[]>([
  { field: 'consignante_master', title: 'Consignante Master', hide: false },
  { field: 'actions', title: 'Ações', hide: false, sort: false, },
])
const rows = reactive([
  {
    id: 1,
    consignante_master: 'MUNIC DE ALMIRANTE TAMANDARÉ',
  },
  {
    id: 2,
    consignante_master: 'MUNIC DE CAMBORIÚ',
  },
])

const filtered = () => {
  if (consignante.value === '' || consignante.value === null) return rows

  return rows.filter(
    (consignantes: any) => consignantes.consignante_master === consignante.value,
  )
}

const parseCols = [
  { field: 'id', title: 'ID', hide: false },
  { field: 'consignante_master', title: 'Consignante Master', hide: false },
]

const clearFilter = () => {
  consignante.value = ''
}
</script>

<template>
  <main>
    <breadcrumbs :paginas="['Cadastro', 'Consignante Master']" />

    <div class="panel pb-0 mt-6">
      <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
        <div class="flex items-center gap-14">
          <titulo title="Consignante Master" />
          <button @click="isOpenDialog = true" v-tippy:right>
            <icon-add />
          </button>
          <tippy target="right" placement="right">Cadastre um novo Consignatario Master</tippy>
        </div>

        <div class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
          <multiselect v-model="consignante" :options="['MUNIC DE ALMIRANTE TAMANDARÉ', 'MUNIC DE CAMBORIÚ']"
            class="custom-multiselect min-w-[250px]" placeholder="Selecione Consignante Master" :searchable="false"
            :preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
            @select="(selected.label = $event), (selected.type = 'consignante')" />

          <div>
            <button v-tippy:top type="button" class="text-xs m-1" @click="clearFilter()">
              <icon-clear class="w-5 h-5 text-primary_3-table" />
            </button>
            <tippy target="top" placement="top">Limpar pesquisa</tippy>
          </div>

          <div class="w-5 h-5">
            <consultas-export v-tippy:top :cols="parseCols" :rows="rows" filename="Extrato Anual dos Descontos"
              export-type="print">
              <template #icon>
                <icon-printer class="w-5 h-5" />
              </template>
            </consultas-export>
            <tippy target="top" placement="top">Imprimir</tippy>
          </div>
        </div>
      </div>

      <div class="datatable mb-[344px]">
        <!-- TODO descobrir o por que essas funções tinham argumentos -->
        <!-- <vue3-datatable :rows="filtered(selected.label)" :columns="cols" :total-rows="filtered(selected.label)?.length" -->
        <vue3-datatable :rows="filtered()" :columns="cols" :total-rows="filtered()?.length" :sortable="true"
          skin="whitespace-nowrap bh-table-striped mb-5" no-data-content="Nenhum dado foi encontrado"
          pagination-info="Mostrando {0} a {1} de {2} entradas">
          <template #actions="data">
            <button v-tippy:right type="button" class="text-xs m-1">
              <icon-edit class="w-5 h-5 text-primary_3-table" />
            </button>
            <tippy target="right" placement="right">Editar {{ data.value.consignante_master }}</tippy>
          </template>
        </vue3-datatable>
      </div>
    </div>

    <modal-layout :is-open="isOpenDialog" title="Cadastrar Consignante Master" size="max-w-[458px]"
      @btn-close="isOpenDialog = false">
      <form>
        <div>
          <label for="name" class="text-sm">Nome</label>
          <input id="name" type="text" class="form-input" />
        </div>
        <div class="flex justify-center gap-12 mt-8">
          <button type="button" class="w-24 text-xs btn border border-primary_3-table shadow-none text-primary_3-table"
            @click="isOpenDialog = false">
            Cancelar
          </button>
          <button type="button" class="w-24 text-xs btn bg-primary_3-table shadow-none text-white">Salvar</button>
        </div>
      </form>
    </modal-layout>
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
