<script lang="ts" setup>
  // Core
  import { reactive, ref } from 'vue'

	// Componentes
  import LabelInput from '@components/layout/forms/inputs/inputLabel.vue'
  import LabelSelect from '@components/layout/forms/inputs/selectLabel.vue'

	// Icons
  import IconCartaoCreditoServico from '@icons/services/iconCartaoCreditoServico.vue'
  import IconConveniosServico from '@icons/services/iconConveniosServicos.vue'
	import IconEmprestimoServico from '@icons/services/iconEmprestimosServicos.vue'
	import IconMensalidadeServico from '@icons/services/iconMensalidadeServicos.vue'
	import IconPlanoSaudeServico from '@icons/services/iconPlanoSaudeServico.vue'
	import IconSegurosServico from '@icons/services/iconSegurosServico.vue'
	import IconComprasServico from '@icons/services/iconComprasServico.vue'
	import iconFinanciamentosServico from '@icons/services/iconFinanciamentosServico.vue'
	import IconCartaoBeneficiosServico from '@icons/services/iconCartaoBeneficiosServico.vue'

	// Declarações

	// Script

  const emits = defineEmits(['btnSave', 'btnCancelar'])

</script>
<template>
	<main>
    <div class="panel mt-5 border border-primary_3-table">
      <label for="consignante_master" class="text-sm md:text-base text-primary_3-table m-0 mb-3">Selecione Consignatária</label>

      <div class="flex flex-col gap-2.5">
        <div class="flex flex-col md:flex-row items-center mb-3">
          <label for="cnpj" class="mb-0 md:mr-2 w-full md:w-1/5 text-sm text-left">CNPJ</label>
          <input id="cnpj" type="text" class="form-input mb-3 md:mb-0 md:max-w-[200px] h-[38px]" />

          <label for="tipo_entidade" class="mb-0 md:ml-3 md:mr-2 w-full md:w-auto text-sm text-left">Tipo de Entidade</label>
          <select id="tipo_entidade" class="form-select md:max-w-[270px] h-[38px]">
            <option value=""></option>
            <option value="Entidade 1">Entidade 1</option>
            <option value="Entidade 2">Entidade 2</option>
            <option value="Entidade 3">Entidade 3</option>
            <option value="Entidade 4">Entidade 4</option>
          </select>
        </div>
        <label-input
          id="nome"
          label="Nome"
          class-label="text-sm"
          class-input="md:max-w-[620px]"
          layout="col"
        />
        <label-input
          id="nome_curto"
          label="Nome curto"
          class-label="text-sm"
          class-input="md:max-w-[250px]"
          layout="col"
        />
        <label-select
          id="tipo_endreco"
          label="Tipo de Endereço"
          class-label="text-sm"
          class-select="md:max-w-[250px]"
          layout="col"
          :options="['Av', 'Alameda', 'Beco', 'Comunidade', 'Estrada', 'Rua']"
        />
        <label-input
          id="endreco_completo"
          label="Endereço Completo"
          class-label="text-sm"
          class-input="md:max-w-[620px]"
          layout="col"
        />

        <div class="flex flex-col md:flex-row items-center mb-3">
          <label for="cidade" class="mb-0 md:mr-2 w-full md:w-1/5 text-sm text-left">Cidade</label>
          <input id="cidade" type="text" class="form-input mb-3 md:mb-0 md:max-w-[250px] h-[38px]" />

          <label for="uf" class="mb-0 md:mr-4 md:ml-8 w-full md:w-auto text-sm text-left">UF</label>
          <input id="uf" type="text" class="form-input mb-3 md:mb-0 md:max-w-[50px] h-[38px]" />

          <label for="cep" class="mb-0 md:mr-4 md:ml-8 w-full md:w-auto text-sm text-left">CEP</label>
          <input id="cep" type="text" class="form-input mb-3 md:mb-0 md:max-w-[150px] h-[38px]" />
        </div>

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
      </div>

      <div class="flex justify-center items-center gap-12 mt-8">
        <button
          type="button"
          class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
          @click="emits('btnCancelar', false)"
        >Cancelar</button>
        <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs">Salvar</button>
      </div>
    </div>
	</main>
</template>
