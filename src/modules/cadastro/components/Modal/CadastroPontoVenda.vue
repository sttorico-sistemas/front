<script lang="ts" setup>
import LabelInput from 'src/core/components/Inputs/InputLabel.vue'
import LabelSelect from 'src/core/components/Inputs/SelectLabel.vue'
import IconCartaoCreditoServico from 'src/core/components/Icons/Services/IconCartaoCreditoServico.vue'
import IconConveniosServico from 'src/core/components/Icons/Services/IconConveniosServicos.vue'
import IconEmprestimoServico from 'src/core/components/Icons/Services/IconEmprestimosServicos.vue'
import IconMensalidadeServico from 'src/core/components/Icons/Services/IconMensalidadeServicos.vue'
import IconPlanoSaudeServico from 'src/core/components/Icons/Services/IconPlanoSaudeServico.vue'
import IconSegurosServico from 'src/core/components/Icons/Services/IconSegurosServico.vue'
import iconFinanciamentosServico from 'src/core/components/Icons/Services/IconFinanciamentosServico.vue'
import IconCartaoBeneficiosServico from 'src/core/components/Icons/Services/IconCartaoBeneficiosServico.vue'

const emits = defineEmits(['btnSave', 'btnCancelar'])
</script>

<template>
  <main>
    <div class="panel mt-5 border border-primary">
      <label class="text-sm md:text-base text-primary m-0 mb-3">Dados do Ponto de Venda</label>

      <label-select id="ponto_venda" label="Tipo Ponto de Venda" class-label="text-sm"
        class-select="w-full md:max-w-[400px] mb-3" layout="row" :options="[]" />

      <label-input id="nome" label="Nome" class-label="text-sm" class-input="md:max-w-[400px] mb-3" layout="row" />

      <div class="flex justify-start items-center gap-2.5">
        <label-select id="cidade" label="Cidade" class-label="text-sm" class-select="w-full md:min-w-[290px] mb-3"
          layout="row" :options="['Rio de Janeiro']" />
        <label-select id="uf" label="UF" class-label="text-sm" class-select="w-full md:min-w-[100px] mb-3" layout="row"
          :options="['RJ']" />
      </div>

      <label-select id="gestor" label="Gestor" class-label="text-sm" class-select="w-full md:max-w-[400px] mb-3"
        layout="row" :options="[]" />

      <div class="flex justify-start items-center gap-2.5">
        <label-input type="tel" id="telefone" label="Telefone" class-label="text-sm" class-input="md:max-w-[195px] mb-3"
          layout="row" />
        <label-input type="cel" id="celular" label="Celular" class-label="text-sm" class-input="md:max-w-[195px] mb-3"
          layout="row" />
      </div>

      <label-input id="email" label="E-mail" class-label="text-sm" class-input="md:max-w-[400px] mb-3" layout="row" />

      <div class="flex flex-col gap-5 mt-4 mb-10">
        <p class="text-sm">Selecione os Tipos de Serviços:</p>
        <div class="h-40 flex flex-col flex-wrap gap-2">
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
      </div>

      <div class="flex justify-center items-center gap-12 mt-8">
        <button type="button"
          class="w-[86px] btn border border-primary shadow-none text-primary text-xs"
          @click="emits('btnCancelar', false)">Cancelar</button>
        <button type="button" class="w-[86px] btn bg-primary text-white text-xs">Salvar</button>
      </div>
    </div>
  </main>
</template>
