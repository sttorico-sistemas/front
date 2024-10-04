<script lang="ts" setup>
import { reactive, ref } from 'vue'

// Componentes
import Vue3Datatable from '@bhplugin/vue3-datatable'
import titulo from 'src/core/components/Titulo.vue'
import breadcrumbs from 'src/core/components/Breadcrumbs.vue'
import modalLayout from 'src/core/components/Modal.vue'
import LabelInput from 'src/core/components/Inputs/InputLabel.vue'

// Icons
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import IconDelete from 'src/core/components/Icons/IconDelete.vue'

// Declarações
const selected = reactive<{ type: string; label: string }>({
  type: '',
  label: '',
})
const isOpenDialog = ref<boolean>(false)
const cols = reactive([
  { field: 'codigo', title: 'Código', hide: false, },
  { field: 'descricao', title: 'Descrição', hide: false, },
  { field: 'actions', title: 'Ação', hide: false, },
])
const rows = reactive([
  {
    id: '1',
    codigo: '1',
    descricao: 'Ativo',
  },
  {
    id: '2',
    codigo: '2',
    descricao: 'Desativado',
  },
])

// Script
const tipo_tabela = ref('') 
</script>

<template>
  <main>
    <breadcrumbs :paginas="['Configurações', 'Tabelas Auxiliares']" />

    <div class="grid grid-cols-2">
      <div class="panel mt-6">
        <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
          <titulo title="Cadastro de Tabelas Auxiliares Tabela" />

          <div class="header_actions flex items-center gap-20">
            <multiselect v-model="tipo_tabela" :options="['Tabela 1', 'Tabela 2']"
              class="custom-multiselect min-w-[400px]" placeholder="Selecione Tabela" :searchable="false"
              :preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
              @select="(selected.label = $event), (selected.type = 'tipo_tabela')" />

            <button @click="isOpenDialog = true" v-tippy:right>
              <icon-add />
            </button>
            <tippy target="right" placement="right">Cadastre um nova tablea auxiliar</tippy>
          </div>
        </div>

        <div class="datatable pb-1">
          <vue3-datatable :rows="rows" :columns="cols" :total-rows="rows?.length" :sortable="true"
            skin="whitespace-nowrap bh-table-striped" no-data-content="Nenhum dado foi encontrado"
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
      </div>
    </div>
  </main>

  <modal-layout :is-open="isOpenDialog" title="Adicionar Nova Descrição" size="max-w-[440px]"
    @btn-close="isOpenDialog = false">
    <div class="flex flex-col">
      <label-input id="tabela" label="Tabela Selecionada" class-label="text-lg text-primary_3-table"
        class-input="md:max-w-[400px] mb-3" layout="row" disabled />
      <label-input id="descricao" label="Nova descrição" class-label="text-sm" class-input="md:max-w-[400px] mb-3"
        layout="row" />
    </div>

    <div class="flex justify-center items-center gap-12 mt-8">
      <button type="button" class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
        @click="isOpenDialog = false">Cancelar</button>
      <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs">Salvar</button>
    </div>
  </modal-layout>
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
