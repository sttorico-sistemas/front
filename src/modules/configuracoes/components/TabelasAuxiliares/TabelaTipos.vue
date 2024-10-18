<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import modalLayout from 'src/core/components/Modal.vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import Titulo from 'src/core/components/Titulo.vue'
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import IconDelete from 'src/core/components/Icons/IconDelete.vue'
import { tabelasAuxiliaresStore } from '../../stores/tabelas_auxiliares.store'
import FormField from 'src/core/components/FormField.vue'
import AppButton from 'src/core/components/AppButton.vue'
import { Col } from 'types/col.d'

const store = tabelasAuxiliaresStore();

const selected = reactive({
  type: '',
  label: '',
})

const cols = reactive<Col[]>([
  { field: 'id', title: 'Código', hide: false, },
  { field: 'value', title: 'Descrição', hide: false, },
  { field: 'actions', title: 'Ação', hide: false, },
]);

onMounted(async () => {
  await store.getValues();
});
</script>

<template>
  <div class="panel mt-6">
    <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
      <titulo title="Cadastro de Tipos" />

      <div class="header_actions flex items-center gap-20">
        <multiselect @update:model-value="store.setSelectedTable($event)"
          :model-value="store.tables.find(e => e.id === store.selectedTable)?.name"
          :options="store.tables.map(e => e.name)" class="custom-multiselect md:min-w-[400px]"
          placeholder="Selecione Tabela" :searchable="false" :allow-empty="false" selected-label="" select-label=""
          deselect-label="" @select="(selected.label = $event), (selected.type = 'tipo_tabela')" />

        <button @click="store.toggleEditor(true)" v-tippy:right>
          <icon-add />
        </button>
        <tippy target="right" placement="right">Cadastre um nova tablea auxiliar</tippy>
      </div>
    </div>

    <div class="datatable pb-1">
      <vue3-datatable :loading="store.loadingData" :rows="store.values" :columns="cols"
        :total-rows="store.values.length" :sortable="true" skin="whitespace-nowrap bh-table-striped"
        no-data-content="Nenhum dado foi encontrado" pagination-info="Mostrando {0} a {1} de {2} entradas"
        :pagination="true" :page-size="100">
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
    <modal-layout :is-open="store.showEditor" title="Adicionar Novo Tipo" size="max-w-[440px]"
      @btn-close="store.toggleEditor(false)">
      <div class="flex flex-col">
        <multiselect :model-value="store.tables.find(e => e.id === store.editingType)?.name"
          @update:model-value="store.updateEditingType($event)" :options="store.tables.map((e) => e.name)"
          class="custom-multiselect md:min-w-[80px] pb-4" :searchable="false" placeholder="Tipo de dado"
          :allow-empty="false" selected-label="" select-label="" deselect-label="">
        </multiselect>
        <form-field :model-value="store.editingTableValue.value" @update:model-value="store.updateEditingName($event)"
          :message="store.error" :error="!!store.error" label="Novo tipo de dado"></form-field>
      </div>

      <div class="flex justify-center items-center gap-12 mt-8">
        <app-button density="comfortable" variant="outlined" width="86px" :disabled="store.saving"
          @click="store.toggleEditor(false)">
          Cancelar
        </app-button>
        <app-button :elevation="0" density="comfortable" width="86px" :loading="store.saving"
          @click="store.saveType()">Salvar</app-button>
        <!-- <button type="button"
          class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
          @click="store.toggleEditor(false)" :disabled="store.saving">Cancelar</button>
        <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs"
          :loading="store.saving">Salvar</button> -->
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