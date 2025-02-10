<script lang="ts" setup>
import flatPickr from 'vue-flatpickr-component'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index.js'
import { reactive, ref } from 'vue'
import { Portuguese } from 'flatpickr/dist/l10n/pt.js'
import breadcrumbs from 'src/core/components/Breadcrumbs.vue'
import titulo from 'src/core/components/Titulo.vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import ConsultasExport from '../components/ConsultasExport.vue'
import ConsultasPopper from '../components/ConsultasPopper.vue'
import IconClear from 'src/core/components/Icons/IconClear.vue'
import IconFile from 'src/core/components/Icons/IconFile.vue'
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue'

const selected = reactive<{ type: string; label: string }>({
  type: '',
  label: '',
})
const servico = ref('')
const consignataria = ref('')
const status = ref('')
const dateSelected = ref('')
const cols = reactive([
  { field: 'rmc', title: 'RMC', hide: false },
  { field: 'data', title: 'Data', hide: false },
  { field: 'n_contrato', title: 'Nº Contrato', isUnique: true, hide: false },
  { field: 'tipo_servico', title: 'Tipo Serviço', hide: false },
  { field: 'tipo_operacao', title: 'Tipo Operação', hide: false },
  { field: 'consignataria', title: 'Consignatária', hide: false },
  { field: 'prazo', title: 'Prazo', hide: false },
  { field: 'valor_desconto', title: 'Valor Desconto', hide: false },
  { field: 'tipo_desconto', title: 'Tipo Desconto', hide: false },
  { field: 'total_desconto', title: 'Total Descontos', hide: false },
  { field: 'status', title: 'Status', hide: false },
])
const rows = reactive([
  {
    rmc: 7079,
    data: 'Dez/2024',
    n_contrato: '0800025698',
    tipo_servico: 'Plano de Saúde',
    tipo_operacao: 'Inclusão Nova',
    consignataria: 'ASPM',
    prazo: 'Indeterminado',
    valor_desconto: 'R$ 50,00',
    tipo_desconto: 'Parcela',
    total_desconto: 'R$ 50,00',
    status: {
      id: 3,
      label: 'Encerrado',
    },
  },
  {
    rmc: 7079,
    data: 'Jan/2024',
    n_contrato: '032156484',
    tipo_servico: 'Mensalidade',
    tipo_operacao: 'Inclusão Nova',
    consignataria: 'ASPM',
    prazo: '120',
    valor_desconto: 'R$ 100,00',
    tipo_desconto: 'Parcela',
    total_desconto: 'R$ 100,00',
    status: {
      id: 2,
      label: 'Suspenso',
    },
  },
  {
    rmc: 7079,
    data: 'Fev/2024',
    n_contrato: '0708206 9605',
    tipo_servico: 'Empréstimos',
    tipo_operacao: 'Portabilidade',
    consignataria: 'ASPM',
    prazo: 'Indeterminado',
    valor_desconto: 'R$ 50,00',
    tipo_desconto: 'Fatura',
    total_desconto: 'R$ 50,00',
    status: {
      id: 1,
      label: 'Ativo',
    },
  },
  {
    rmc: 7079,
    data: 'Mar/2024',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
    tipo_operacao: 'Portabilidade',
    consignataria: 'Banco do Brasil S/A',
    prazo: 'Indeterminado',
    valor_desconto: 'R$ 50,00',
    tipo_desconto: 'Fatura',
    total_desconto: 'R$ 50,00',
    status: {
      id: 1,
      label: 'Ativo',
    },
  },
  {
    rmc: 7079,
    data: 'Abr/2024',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
    tipo_operacao: 'Portabilidade',
    consignataria: 'Banco Daycoval S/A',
    prazo: 'Indeterminado',
    valor_desconto: 'R$ 50,00',
    tipo_desconto: 'Fatura',
    total_desconto: 'R$ 50,00',
    status: {
      id: 1,
      label: 'Ativo',
    },
  },
  {
    rmc: 7079,
    data: 'Mai/2024',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras/Saque',
    tipo_operacao: 'Portabilidade',
    consignataria: 'Meu CaschCard',
    prazo: 'Indeterminado',
    valor_desconto: 'R$ 50,00',
    tipo_desconto: 'Fatura',
    total_desconto: 'R$ 50,00',
    status: {
      id: 1,
      label: 'Ativo',
    },
  },
])
const columns = reactive({
  RMC: 'rmc',
  Data: 'data',
  'Nº Contrato': 'n_contrato',
  'Tipo Serviço': 'tipo_servico',
  'Tipo Operação': 'tipo_operacao',
  Consignatária: 'consignataria',
  Prazo: 'prazo',
  'Valor Desconto': 'valor_desconto',
  'Tipo Desconto': 'tipo_desconto',
  'Total Desconto': 'total_desconto',
  Status: 'status.label',
})
const flatPickrConfig = reactive({
  locale: Portuguese,
  plugins: [
    monthSelectPlugin({
      shorthand: true,
      dateFormat: 'M/Y',
    }),
  ],
})

const clearFilter = () => {
  servico.value = ''
  consignataria.value = ''
  status.value = ''
  dateSelected.value = ''

  selected.label = ''
  selected.type = ''
}

const color = (id: number | string): string => {
  switch (id) {
    case 1:
      return 'bg-primary'
    case 2:
      return 'bg-danger'
    case 3:
      return 'bg-secondary'
    case 4:
      return 'bg-warning'
    default:
      return '#E0E6ED'
  }
}

const filtered = (value: string = '') => {
  if (value === '') return rows

  if (selected.type === 'servico')
    return rows.filter((item: any) => item.tipo_servico === value)

  if (selected.type === 'consignataria')
    return rows.filter((item: any) => item.consignataria === value)

  if (selected.type === 'situacao')
    return rows.filter((item: any) => item.status.label === value)

  if (selected.type === 'date')
    return rows.filter((item: any) => item.data === value)
}
</script>

<template>
  <main>
    <breadcrumbs :paginas="['Consultas', 'Contratos']" />

    <div class="panel pb-0 mt-6">
      <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
        <titulo title="Resumo dos Contratos" />

        <div class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
          <consultas-popper label="Colunas" :options="cols" />
          <flat-pickr v-model="dateSelected" class="form-input form-select" placeholder="Selecione um data"
            :config="flatPickrConfig" @change="
              (selected.label = $event.target.value), (selected.type = 'date')
              " />
          <multiselect v-model="consignataria" :options="[
            'Banco Daycoval S/A',
            'Meu CaschCard',
            'Banco do Brasil S/A',
            'ASPM',
          ]" class="custom-multiselect max-w-[200px]" placeholder="Selecione a Consignatária" :searchable="false"
            :preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label="" @select="
              (selected.label = $event), (selected.type = 'consignataria')
              " />
          <multiselect v-model="servico" :options="[
            'Plano de Saúde',
            'Mensalidade',
            'Empréstimos',
            'Compras',
            'Compras/Saque',
          ]" class="custom-multiselect max-w-[230px]" placeholder="Selecione o tipo de serviço" :searchable="false"
            :preselect-first="false" :allow-empty="false" selected-label="" select-label="" deselect-label=""
            @select="(selected.label = $event), (selected.type = 'servico')" />
          <multiselect v-model="status" :options="['Encerrado', 'Suspenso', 'Ativo']"
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
            <download-excel v-tippy:top :fields="columns" :data="rows" name="resumo-dos-contratos.xls"
              class="text-xs m-1 cursor-pointer">
              <icon-file class="w-5 h-5" />
            </download-excel>
            <tippy target="top" placement="top">Exportar XLS</tippy>
          </div>

          <div>
            <consultas-export v-tippy:top :cols="cols" :rows="rows" export-type="print" filename="Resumo dos Contratos">
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
          <template #rmc="data">
            <button>
              <strong class="text-primary">{{ data.value.rmc }}</strong>
            </button>
          </template>
          <template #n_contrato="data">
            <button>
              <strong class="text-primary">{{
                data.value.n_contrato
              }}</strong>
            </button>
          </template>
          <template #status="data">
            <span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.status.id)">{{
              data.value.status.label }}</span>
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

.flatpickr-input::placeholder {
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  color: rgb(14 23 38);
}
</style>
