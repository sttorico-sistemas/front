<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { reactive, ref } from 'vue'


// Componentes
import breadcrumbs from '@/core/components/Breadcrumbs.vue'
import titulo from '@/core/components/Titulo.vue'
import loadingFixed from '@/core/components/LoadingFixed.vue'
import modalLayout from '@/core/components/Modal.vue'

import ConsultasExport from '../components/ConsultasExport.vue'
import ConsultaResumoMargemPrincipal from '../components/ResumoMargem/MargemPrincipal.vue'
import ConsultaSaldoDisponivelMargem from '../components/ResumoMargem/SaldoDisponivelMargem.vue'

// Icons
import IconEye from '@/core/components/Icons/IconEye.vue'
import IconPrinter from '@/core/components/Icons/IconPrinter.vue'

// Declarações
const isOpenDialog = ref<boolean>(false)
const dataMargemAtualizada = ref<string>('23/10/2023')
const cols = reactive([
  { field: 'tipo_margem', title: 'Tipo da Margem', hide: false, sort: false, },
  { field: 'limite', title: 'Limite %', hide: false, sort: false, },
  { field: 'valor_margem', title: 'Valor Margem', hide: false, sort: false, },
  { field: 'margem_reservada', title: 'Margem Reservada', hide: false, sort: false, },
  { field: 'uso_margem', title: 'Gráfico do uso da Margem', hide: false, sort: false, },
  { field: 'action', title: 'Ações', hide: false, sort: false, },
])
const rows = reactive([
  {
    id: 1,
    tipo_margem: 'Margem Geral',
    limite: '40%',
    valor_margem: 'R$ 400,00',
    margem_reservada: 'R$ 350,00',
    uso_margem: 87.5,
  },
  {
    id: 2,
    tipo_margem: 'Margem Principal',
    limite: '35%',
    valor_margem: 'R$ 350,00',
    margem_reservada: 'R$ 300,00',
    uso_margem: 85,
  },
  {
    id: 3,
    tipo_margem: 'Margem Secundária',
    limite: '5%',
    valor_margem: 'R$ 50,00',
    margem_reservada: 'R$ 25,00',
    uso_margem: 50,
  },
  {
    id: 4,
    tipo_margem: 'Margem Adicional',
    limite: '10%',
    valor_margem: 'R$ 100,00',
    margem_reservada: 'R$ 75,00',
    uso_margem: 50,
  },
])

// Scripts
const openModal = (id: number) => isOpenDialog.value = true

const formatedCurrency = (value: number) => {
  return value.toLocaleString('pt-br', {
    style: 'decimal',
    minimumFractionDigits: 2,
  })
}
</script>

<template>
  <main>
    <breadcrumbs :paginas="['Consultas', 'Resumo da Margem']" />

    <div class="panel mt-6">
      <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
        <titulo title="Resumo da Margem Consignável"
          info-message="Alguma mensagem aqui para tirar dúvida sobre a página" />

        <div class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
          <div class="w-5 h-5">
            <consultas-export v-tippy:top :cols="cols" :rows="rows" filename="Extrato Anual dos Descontos"
              export-type="print">
              <template #icon>
                <icon-printer class="w-5 h-5" />
              </template>
            </consultas-export>
            <tippy target="top" placement="top">Imprimir</tippy>
          </div>
        </div>
      </div>

      <div class="panel mt-6 datatable">
        <div class="flex justify-between items-center mb-8">
          <p class="text-primary_3 text-base font-semibold">
            Distribuição da Margem
          </p>
          <span class="font-xs font-semibold text-primary_3">Data da atualização da margem: <strong
              class="ml-3 font-xs font-semibold text-[#2196F3]">{{ dataMargemAtualizada }}</strong></span>
        </div>

        <vue3-datatable :rows="rows" :columns="cols" :total-rows="rows.length" :sortable="true"
          skin="whitespace-nowrap bh-table-striped mb-5" no-data-content="Nenhum dado foi encontrado"
          pagination-info="Mostrando {0} a {1} de {2} entradas" :pagination="false">
          <template #uso_margem="data">
            <div class="flex justify-between items-center gap-3">
              <div class="w-10/12 rounded-full h-2 bg-dark-light shadow">
                <loading-fixed :color="data.value.id" :percent="data.value.uso_margem" />
              </div>
              <span class="text-xs">{{ formatedCurrency(data.value.uso_margem) }}%</span>
            </div>
          </template>
          <template #action="data">
            <button v-tippy:right type="button" class="text-xs m-1" @click="openModal(data.value.id)">
              <icon-eye class="w-5 h-5 text-primary_3-table" />
            </button>
            <tippy target="right" placement="right">Ver resumo da margem principal</tippy>
          </template>
        </vue3-datatable>
      </div>
    </div>

    <consulta-saldo-disponivel-margem />

    <modal-layout :is-open="isOpenDialog" title="Resumo da Margem Principal" size="w-[415px]" btn-close
      @btn-close="isOpenDialog = false">
      <!-- Datatable-->
      <consulta-resumo-margem-principal />
      <!-- Datatable-->
    </modal-layout>
  </main>
</template>
<style lang="scss">
#saldo_disponivel {
  .saldo_disponivel__valor {
    width: 272px;
    height: 48px;
    color: var(--Dark, #3b3f5c);
    font-size: 32px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .calcula_saldo {
    color: var(--Dark, #3b3f5c);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  .custom-multiselect.multiselect .multiselect__tags {
    padding-top: 0.8rem !important;
    padding-bottom: 0.8rem !important;
  }
}
</style>
