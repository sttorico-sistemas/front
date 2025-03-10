<script lang="ts" setup>
import { reactive, ref } from 'vue'
import breadcrumbs from 'src/core/components/Breadcrumbs.vue'
import titulo from 'src/core/components/Titulo.vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import ConsultasExport from '../components/ConsultasExport.vue'
import ImageName from '../components/ConsultasHistorico/DatatableColunaImageName.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'
import IconEye from 'src/core/components/Icons/IconEye.vue'
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue'
import { Col } from 'types/col.d'

const selected = reactive({
  type: '',
  label: '',
})
const status = ref('')
const cols = reactive<Col[]>([
  { field: 'id', title: 'ID', hide: true },
  { field: 'data', title: 'Data', hide: false },
  { field: 'protocolo', title: 'Protocolo', hide: false },
  { field: 'solicitacao', title: 'Solicitação', hide: false },
  { field: 'solicitado', title: 'Solicitado', hide: false, sort: false },
  { field: 'status', title: 'Status', hide: false, sort: false },
  { field: 'acao', title: 'Ação', hide: false, sort: false },
])
const rows = reactive([
  {
    id: 1,
    data: '10/03/2023',
    protocolo: '2024001002',
    solicitacao: 'Solicitação de Proposta',
    solicitado: {
      nome: 'Banco do Brasil',
      tipo: 'Instituição Financeira',
      icone: '',
    },
    status: {
      id: 1,
      label: 'Em andamento',
    },
  },
  {
    id: 2,
    data: '10/03/2023',
    protocolo: '2023001003',
    solicitacao: 'Solicitação Saldo Devedor',
    solicitado: {
      nome: 'Santander Brasil',
      tipo: 'Instituição Financeira',
      icone: '',
    },
    status: {
      id: 2,
      label: 'Finalizada',
    },
  },
])

const clearFilter = () => {
  status.value = ''
  selected.label = ''
  selected.type = ''
}

const color = (id: number | string): string => {
  switch (id) {
    case 1:
      return 'bg-success'
    case 3:
      return 'bg-danger'
    case 4:
      return 'bg-secondary'
    case 2:
      return 'bg-warning'
    default:
      return '#E0E6ED'
  }
}

const filtered = (value: string = '') => {
  if (value === '') return rows
  if (selected.type === 'situacao')
    return rows.filter((item: any) => item.status.label === value)
}

const parseRows = (): Array<object> => {
  return rows.map((row) => {
    return {
      id: row.id,
      data: row.data,
      protocolo: row.protocolo,
      solicitacao: row.solicitacao,
      solicitado: row.solicitado.nome,
      status: {
        id: row.status.id,
        label: row.status.label,
      },
    }
  })
}

const parseCols = () => {
  return [
    { field: 'id', title: 'ID', hide: true },
    { field: 'data', title: 'Data', hide: false },
    { field: 'protocolo', title: 'Protocolo', hide: false },
    { field: 'solicitacao', title: 'Solicitação', hide: false },
    { field: 'solicitado', title: 'Solicitado', hide: false },
    { field: 'status', title: 'Status', hide: false },
  ]
}
</script>

<template>
  <main>
    <breadcrumbs :paginas="['Consultas', 'Solicitações']" />
    <div class="panel pb-0 mt-6">
      <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
        <titulo title="Solicitações Realizadas" />

        <div class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
          <multiselect v-model="status" :options="['Em andamento', 'Finalizada']"
            class="custom-multiselect max-w-[200px]" placeholder="Selecione a Situação" :searchable="false"
            :preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
            @select="(selected.label = $event), (selected.type = 'situacao')" />

          <div>
            <button v-tippy:top type="button" class="text-xs m-1" @click="clearFilter()">
              <icon-clear class="w-5 h-5 text-primary" />
            </button>
            <tippy target="top" placement="top">Limpar pesquisa</tippy>
          </div>

          <div>
            <consultas-export v-tippy:top :cols="parseCols()" :rows="parseRows()" filename="Histórico das Solicitações"
              export-type="print">
              <template #icon>
                <icon-printer class="w-5 h-5" />
              </template>
            </consultas-export>
            <tippy target="top" placement="top">Imprimir</tippy>
          </div>
        </div>
      </div>

      <div class="datatable">
        <vue3-datatable :rows="filtered(selected.label)" :columns="cols" :total-rows="filtered(selected.label)?.length"
          :sortable="true" skin="whitespace-nowrap bh-table-striped" no-data-content="Nenhum dado foi encontrado"
          pagination-primary="Mostrando {0} a {1} de {2} entradas">
          <template #solicitado="data">
            <image-name image="https://placehold.co/30x30" :name="data.value.solicitado.nome" />
          </template>
          <template #status="data">
            <span class="flex justify-center badge !w-[110px] h-[22px]" :class="color(data.value.status.id)">{{
              data.value.status.label }}</span>
          </template>
          <template #acao="data">
            <button v-tippy:right type="button" class="text-xs m-1">
              <icon-eye class="w-5 h-5 text-primary" />
            </button>
            <tippy target="right" placement="right">Algum texto aqui {{ data.value.id }}</tippy>
          </template>
        </vue3-datatable>
      </div>
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
