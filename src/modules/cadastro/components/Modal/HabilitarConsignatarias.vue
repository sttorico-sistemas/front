<script lang="ts" setup>
// Componentes
import LabelInput from '@/core/components/layout/forms/inputs/inputLabel.vue'
import LabelSelect from '@/core/components/layout/forms/inputs/selectLabel.vue'

// Icons
import IconCartaoCreditoServico from '@/core/components/icons/services/iconCartaoCreditoServico.vue'
import IconConveniosServico from '@/core/components/icons/services/iconConveniosServicos.vue'
import IconEmprestimoServico from '@/core/components/icons/services/iconEmprestimosServicos.vue'
import IconMensalidadeServico from '@/core/components/icons/services/iconMensalidadeServicos.vue'
import IconPlanoSaudeServico from '@/core/components/icons/services/iconPlanoSaudeServico.vue'
import IconSegurosServico from '@/core/components/icons/services/iconSegurosServico.vue'
import iconFinanciamentosServico from '@/core/components/icons/services/iconFinanciamentosServico.vue'
import IconCartaoBeneficiosServico from '@/core/components/icons/services/iconCartaoBeneficiosServico.vue'

// Script
const emits = defineEmits(['btnSave', 'btnCancelar'])
</script>

<template>
  <main>
    <div class="panel mt-5 border border-primary_3-table">
      <label for="consignante_master" class="text-sm md:text-base text-primary_3-table m-0 mb-3">Selecione
        Consignatária</label>

      <div class="flex flex-col gap-2.5">
        <label-select id="tipo_insituicao" label="Tipo de Instituição" class-label="text-sm"
          class-select="md:max-w-[400px]" layout="row"
          :options="['Instituição Financeira', 'Cooperativa de Crédito']" />
        <label-select id="consignataria" label="Consignatária" class-label="text-sm" class-select="md:max-w-[400px]"
          layout="row" :options="['Banco do Brasil', 'Banco Daycoval']" />

        <div class="flex flex-col gap-5 mt-4 mb-10">
          <span class="text-sm">Selecione os Tipos de Serviços:</span>

          <div class="flex items-center gap-4">
            <input id="emprestimo" type="checkbox" class="form-checkbox" />
            <icon-emprestimo-servico class="w-7 w-7" />
            <label for="emprestimo" class="mb-0 text-xs">Empréstimos</label>
          </div>
          <div class="flex items-center gap-4">
            <input id="compras" type="checkbox" class="form-checkbox" />
            <icon-convenios-servico class="w-7 w-7" />
            <label for="compras" class="mb-0 text-xs">Compras</label>
          </div>
          <div class="flex items-center gap-4">
            <input id="mensalidade" type="checkbox" class="form-checkbox" />
            <icon-mensalidade-servico class="w-7 w-7" />
            <label for="mensalidade" class="mb-0 text-xs">Mensalidades</label>
          </div>
          <div class="flex items-center gap-4">
            <input id="cartao_credito" type="checkbox" class="form-checkbox" />
            <icon-cartao-credito-servico class="w-7 w-7" />
            <label for="cartao_credito" class="mb-0 text-xs">Cartão de Crédito</label>
          </div>
          <div class="flex items-center gap-4">
            <input id="cartao_beneficio" type="checkbox" class="form-checkbox" />
            <icon-cartao-beneficios-servico class="w-7 w-7" />
            <label for="cartao_beneficio" class="mb-0 text-xs">Cartão de Benefícios</label>
          </div>
          <div class="flex items-center gap-4">
            <input id="plano_saude" type="checkbox" class="form-checkbox" />
            <icon-plano-saude-servico class="w-7 w-7" />
            <label for="plano_saude" class="mb-0 text-xs">Plano de Saúde</label>
          </div>
          <div class="flex items-center gap-4">
            <input id="financiamentos" type="checkbox" class="form-checkbox" />
            <icon-financiamentos-servico class="w-7 w-7" />
            <label for="financiamentos" class="mb-0 text-xs">Financiamentos</label>
          </div>
          <div class="flex items-center gap-4">
            <input id="seguros" type="checkbox" class="form-checkbox" />
            <icon-seguros-servico class="w-7 w-7" />
            <label for="seguros" class="mb-0 text-xs">Seguros</label>
          </div>
        </div>

        <div class="flex justify-center gap-12">
          <label-input id="data_habilitacao" label="Data de Habilitação" class-label="text-sm"
            class-input="md:max-w-[150px]" layout="row" />
          <label-input id="data_renovacao" label="Data de Renovação" class-label="text-sm"
            class-input="md:max-w-[150px]" layout="row" />
        </div>
      </div>

      <div class="flex justify-center items-center gap-12 mt-8">
        <button type="button"
          class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
          @click="emits('btnCancelar', false)">Cancelar</button>
        <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs">Salvar</button>
      </div>
    </div>
  </main>
</template>