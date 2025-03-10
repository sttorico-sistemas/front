<script lang="ts" setup>
import { reactive, ref } from 'vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import titulo from 'src/core/components/Titulo.vue'
import breadcrumbs from 'src/core/components/Breadcrumbs.vue'
import modalLayout from 'src/core/components/Modal.vue'
import ImageName from 'src/modules/consultas/components/ConsultasHistorico/DatatableColunaImageName.vue'
import CadastrarLogomarca from '../components/CadastrarLogomarca.vue'
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconDelete from 'src/core/components/Icons/IconDelete.vue'
import { Col } from 'types/col.d'

const selected = reactive<{ type: string; label: string }>({
  type: '',
  label: '',
})
const instituicao = ref('')
const tipo_instituicao = ref('')
const isOpenDialog = ref(false)
const cols = reactive<Col[]>([
  { field: 'logo', title: 'Logo', hide: false, },
  { field: 'instituicao', title: 'Instituição', hide: false, },
  { field: 'tipo_instituicao', title: 'Tipo de Instituição', hide: false, },
  { field: 'actions', title: 'Ação', hide: false, },
])
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
    instituicao: 'ASM- Associação Servidores de Macapá',
    tipo_instituicao: 'Associação de Servidores Públicos',
  },
])

const filtered = (value: string = '') => {
  if (value === '') return rows

  if (selected.type === 'instituicao')
    return rows.filter((item: any) => item.instituicao === value)
}
</script>

<template>
  <main>
    <breadcrumbs :paginas="['Configurações', 'Logomarcas']" />

    <div class="panel mt-6">
      <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">

        <div class="flex items-center gap-14">
          <titulo title="Logomarcas" />
          <button @click="isOpenDialog = true" v-tippy:right>
            <icon-add />
          </button>
          <tippy target="right" placement="right">Cadastre uma nova logomarca</tippy>
        </div>

        <div class="header_actions flex items-center gap-2">
          <multiselect v-model="instituicao" :options="['Banco do Brasil', 'ASM- Associação Servidores de Macapá']"
            class="custom-multiselect min-w-[200px]" placeholder="Instituição" :searchable="false"
            :preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
            @select="(selected.label = $event), (selected.type = 'instituicao')" />
          <multiselect v-model="tipo_instituicao"
            :options="['Instituição Financeira', 'Associação de Servidores Públicos']"
            class="custom-multiselect min-w-[150px]" placeholder="Tipo Instituição" :searchable="false"
            :preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
            @select="(selected.label = $event), (selected.type = 'tipo_instituicao')" />
        </div>
      </div>

      <div class="datatable pb-1">
        <vue3-datatable :rows="filtered(selected.label)" :columns="cols" :total-rows="filtered(selected.label)?.length"
          :sortable="true" skin="whitespace-nowrap bh-table-striped" no-data-content="Nenhum dado foi encontrado"
          pagination-primary="Mostrando {0} a {1} de {2} entradas">
          <template #logo="data">
            <image-name image="https://placehold.co/30x30" />
          </template>
          <template #actions="data">
            <div class="flex gap-2">
              <div>
                <button v-tippy:right type="button" class="text-xs m-1">
                  <icon-delete class="w-5 h-5 text-primary" />
                </button>
                <tippy target="right" placement="right">Deletar</tippy>
              </div>
            </div>
          </template>
        </vue3-datatable>
      </div>
    </div>
  </main>

  <modal-layout :is-open="isOpenDialog" title="Adicionar Logomarca" size="max-w-[650px]"
    @btn-close="isOpenDialog = false">
    <cadastrar-logomarca @btn-cancelar="isOpenDialog = false" />
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
