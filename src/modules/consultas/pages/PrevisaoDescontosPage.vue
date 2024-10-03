<script lang="ts" setup>
import { reactive } from 'vue'

// Componentes
import breadcrumbs from '@/core/components/Breadcrumbs.vue'
import titulo from '@/core/components/Titulo.vue'

import Vue3Datatable from '@bhplugin/vue3-datatable'

import ImageName from '../components/ConsultasHistorico/DatatableColunaImageName.vue'

// Icons
import IconCartaoCreditoServico from '@/core/components/icons/services/iconCartaoCreditoServico.vue'
import IconEmprestimoServico from '@/core/components/icons/services/iconEmprestimosServicos.vue'
import IconMensalidadeServico from '@/core/components/icons/services/iconMensalidadeServicos.vue'
import IconPlanoSaudeServico from '@/core/components/icons/services/iconPlanoSaudeServico.vue'
import IconSegurosServico from '@/core/components/icons/services/iconSegurosServico.vue'

// Declarações
const cols = reactive([
  { field: 'consignataria', title: 'Consignatária', hide: false, sort: false, },
  { field: 'tipo_servicos', title: 'Tipo de Serviços', hide: false, sort: false, },
  { field: 'contrato', title: 'Contrato', hide: false },
  { field: 'prazo', title: 'Prazo', hide: false },
  { field: 'parcela', title: 'Parcela', hide: false },
  { field: 'valor_desconto', title: 'Vlr Desconto', hide: false },
  { field: 'valor_enviar', title: 'Vlr à Enviar', hide: false },
  { field: 'saldo_desconto', title: 'Saldo Desconto', hide: false },
  { field: 'observacao', title: 'Observação', hide: false },

])
const rows = reactive([
  {
    consignataria: {
      nome: 'Banco do Brasil',
      tipo: 'Instituição Financeira',
      icone: '',
    },
    tipo_servicos: [
      {
        nome: 'Emprestimo',
        icone: 'emprestimo',
      },
    ],
    contrato: '202312346789000',
    prazo: '120',
    parcela: '31',
    valor_desconto: 'R$ 1.000,00',
    valor_enviar: 'R$ 900,00',
    saldo_desconto: 'R$ 100,00',
    observacao: 'Insuficiência de margem',
  },
])

// Script
const iconeService = (value: string) => {
  switch (value) {
    case 'emprestimo':
      return IconEmprestimoServico
    case 'compras':
      return ''
    case 'mensalidades':
      return IconMensalidadeServico
    case 'cartao-credito':
      return IconCartaoCreditoServico
    case 'cartao-beneficios':
      return ''
    case 'plano-saude':
      return IconPlanoSaudeServico
    case 'financiamentos':
      return ''
    case 'seguros':
      return IconSegurosServico
    default:
      return 'https://placehold.co/30x30?text=TS'
  }
}
</script>
<template>
  <main>
    <breadcrumbs :paginas="['Simulador', 'Previsão de Descontos']" />
    <div class="panel pb-0 mt-6">
      <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
        <titulo title="Previsão de Descontos para próxima folha de pagamento" />
      </div>

      <div class="datatable pb-1">
        <vue3-datatable :rows="rows" :columns="cols" :total-rows="rows.length" :sortable="true"
          skin="whitespace-nowrap bh-table-striped" :pagination="false" no-data-content="Nenhum dado foi encontrado"
          pagination-info="Mostrando {0} a {1} de {2} entradas">
          <template #consignataria="data">
            <image-name image="https://placehold.co/30x30" :name="data.value.consignataria.nome" />
          </template>
          <template #tipo_servicos="data">
            <div class="flex">
              <template v-for="(tipo_servico, idx) in data.value.tipo_servicos" :key="idx">
                <image-name v-tippy:top :name="tipo_servico.nome">
                  <component :is="iconeService(tipo_servico.icone)" />
                </image-name>
              </template>
            </div>
          </template>
        </vue3-datatable>

        <table class="datatable_totais w-full h-11 py-3 mt-3 mb-11 bg-[#E9F0FE]/30">
          <tr>
            <td width="164px"></td>
            <td width="150px"></td>
            <td width="148px"></td>
            <td width="98px"></td>
            <td width="110px">Totais:</td>
            <td width="146px">R$ 1.000,00</td>
            <td width="137px">R$ 900,00</td>
            <td width="165px">R$ 100,00</td>
            <td width="183px"></td>
          </tr>
        </table>
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

.datatable {
  &_totais {
    color: #1384AD;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
}
</style>
