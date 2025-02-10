<script lang="ts" setup>
import { reactive, ref } from 'vue'
import modalLayout from 'src/core/components/Modal.vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { Col } from 'types/col.d';

const props = withDefaults(defineProps<{
  cols: Col[];
  rows: Record<string, any>[];
  selected?: Record<string, any>;
}>(), {
  selected: () => ({}),
});

const isOpenDialog = ref(false)
const columnsModal = reactive([
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
const rowsModal = reactive([
  {
    rmc: 7079,
    data: '07/18/2017',
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
    data: '05/05/2017',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
    data: '03/27/2017',
    n_contrato: '0708206 9605',
    tipo_servico: 'Compras',
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
])

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
  if (value === '') return props.rows

  if (props.selected.type === 'tipo_de_consignacao')
    return props.rows.filter((item: any) => item.tipo_consignado === value)

  if (props.selected.type === 'consignataria')
    return props.rows.filter((item: any) => item.consignataria === value)

  if (props.selected.type === 'situacao')
    return props.rows.filter((item: any) => item.status.label === value)

  if (props.selected.type === 'date')
    return props.rows.filter((item: any) => item.data === value)
}
</script>

<template>
  <div class="datatable mb-[344px]">
    <vue3-datatable :rows="filtered(props.selected.label)" :columns="props.cols"
      :total-rows="filtered(props.selected.label)?.length" :sortable="true" skin="whitespace-nowrap bh-table-striped"
      no-data-content="Nenhum dado foi encontrado" pagination-primary="Mostrando {0} a {1} de {2} entradas">
      <template #rmc="data">
        <button @click="isOpenDialog = true">
          <strong class="text-primary">{{ data.value.rmc }}</strong>
        </button>
      </template>
      <template #status="data">
        <span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.status.id)">{{
          data.value.status.label }}</span>
      </template>
    </vue3-datatable>
  </div>

  <!-- Modal -->
  <modal-layout :is-open="isOpenDialog" title="Resumo dos Contratos" size="max-w-full" btn-close
    @btn-close="isOpenDialog = false">
    <!-- Datatable-->
    <div class="datatable">
      <vue3-datatable :rows="rowsModal" :columns="columnsModal" :total-rows="rowsModal.length" :sortable="true"
        skin="whitespace-nowrap bh-table-striped" no-data-content="Nenhum dado foi encontrado"
        pagination-primary="Mostrando {0} a {1} de {2} entradas" page-size="5">
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
    <!-- Datatable-->
  </modal-layout>
  <!-- Modal -->
</template>

<style lang="scss">
.datatable .bh-table-responsive table thead tr th {
  color: #1384ad;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

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
