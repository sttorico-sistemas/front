<script lang="ts" setup>
import { reactive, ref } from 'vue'
import modalLayout from 'src/core/components/Modal.vue'
import LabelInput from 'src/core/components/Inputs/InputLabel.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable'
import Titulo from 'src/core/components/Titulo.vue';
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import IconDelete from 'src/core/components/Icons/IconDelete.vue'

const selected = reactive({
  type: '',
  label: '',
})

const isOpenDialog = ref(false)
const cols = reactive([
  { field: 'codigo', title: 'Código', hide: false, },
  { field: 'cidade', title: 'Cidade', hide: false, },
  { field: 'uf', title: 'UF', hide: false, },
  { field: 'actions', title: 'Ação', hide: false, },
])
const rows = reactive([
  {
    id: '1',
    codigo: '1',
    cidade: 'Balneário Camboriú',
    uf: 'SC',
  },
  {
    id: '2',
    codigo: '2',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
  },
])

const filtered = (value: string = '') => {
  if (value === '') return rows

  if (selected.type === 'cidade')
    return rows.filter((item: any) => item.cidade === value)

  if (selected.type === 'uf')
    return rows.filter((item: any) => item.uf === value)
}

const uf = ref('');
const cidade = ref('');
</script>

<template>
  <div class="panel mt-6">
    <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
      <div class="flex items-center gap-14">
        <titulo title="Cadastro de Cidades" />
        <button @click="isOpenDialog = true" v-tippy:right>
          <icon-add />
        </button>
        <tippy target="right" placement="right">Cadastre um nova cidade</tippy>
      </div>

      <div class="header_actions flex items-center gap-5">
        <multiselect v-model="uf" :options="['SC', 'RJ']" class="custom-multiselect md:min-w-[80px]" placeholder="UF"
          :searchable="false" :preselect-first="false" :allow-empty="false" selected-label="" select-label=""
          deselect-label="" @select="(selected.label = $event), (selected.type = 'uf')" />
        <multiselect v-model="cidade" :options="['Balneário Camboriú', 'Rio de Janeiro']"
          class="custom-multiselect md:min-w-[400px]" placeholder="Selecione Cidade " :searchable="false"
          :preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
          @select="(selected.label = $event), (selected.type = 'cidade')" />
      </div>
    </div>

    <div class="datatable pb-1">
      <vue3-datatable :rows="filtered(selected.label)" :columns="cols" :total-rows="filtered(selected.label)?.length"
        :sortable="true" skin="whitespace-nowrap bh-table-striped" no-data-content="Nenhum dado foi encontrado"
        pagination-info="Mostrando {0} a {1} de {2} entradas" :pagination="false">
        <template #actions="data">
          <div class="flex gap-2">
            <div>
              <button v-tippy:right type="button" class="text-xs m-1">
                <icon-edit class="w-5 h-5 text-primary_3-table" />
              </button>
              <tippy target="right" placement="right">Editar</tippy>
            </div>
            <div>
              <button v-tippy:right type="button" class="text-xs m-1">
                <icon-delete class="w-5 h-5 text-primary_3-table" />
              </button>
              <tippy target="right" placement="right">Deletar</tippy>
            </div>
          </div>
        </template>
      </vue3-datatable>
    </div>
    <modal-layout :is-open="isOpenDialog" title="Cadastro Cidade" size="max-w-[440px]"
      @btn-close="isOpenDialog = false">
      <div class="flex flex-col">
        <label-input id="cidade" label="Cidade" class-label="text-sm" class-input="md:max-w-[400px] mb-3"
          layout="row" />
        <label-input id="uf" label="UF" class-label="text-sm" class-input="md:max-w-[80px] mb-3" layout="row" />
      </div>

      <div class="flex justify-center items-center gap-12 mt-8">
        <button type="button"
          class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
          @click="isOpenDialog = false">Cancelar</button>
        <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs">Salvar</button>
      </div>
    </modal-layout>
  </div>
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