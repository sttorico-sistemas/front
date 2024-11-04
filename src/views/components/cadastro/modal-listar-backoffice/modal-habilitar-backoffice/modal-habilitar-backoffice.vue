<script setup lang="ts">
  // Componentes
  import LabelSelect from '@components/layout/forms/inputs/selectLabel.vue'

  // Icones
  import IconCartaoCreditoServico from '@icons/services/iconCartaoCreditoServico.vue'
  import IconEmprestimoServico from '@icons/services/iconEmprestimosServicos.vue'
  import IconMensalidadeServico from '@icons/services/iconMensalidadeServicos.vue'
  import IconConveniosServico from '@icons/services/iconConveniosServicos.vue'
  import IconComprasServico from '@icons/services/iconComprasServico.vue'

  // Scripts
  const emits = defineEmits(['btnSave', 'btnCancelar'])
</script>
<template>
  <div class="panel flex flex-col">
    <label-select
      id="backoffice"
      label="Backoffice"
      class-label="text-sm"
      class-select="md:w-[300px]"
      layout="row"
      :options="[]"
    />

    <div class="flex flex-col gap-5 mt-4">
      <span class="text-lg text-primary_3-table">Selecione os Serviços</span>

      <div class="flex items-center gap-4">
        <input id="emprestimo" type="checkbox" class="form-checkbox" />
        <icon-emprestimo-servico class="w-7" />
        <label for="emprestimo" class="mb-0 text-xs">Empréstimos</label>
      </div>
      <div class="flex items-center gap-4">
        <input id="compras" type="checkbox" class="form-checkbox" />
        <icon-compras-servico class="w-7" />
        <label for="compras" class="mb-0 text-xs">Compras</label>
      </div>
      <div class="flex items-center gap-4">
        <input id="mensalidade" type="checkbox" class="form-checkbox" />
        <icon-mensalidade-servico class="w-7" />
        <label for="mensalidade" class="mb-0 text-xs">Mensalidades</label>
      </div>
      <div class="flex items-center gap-4">
        <input id="cartao_credito" type="checkbox" class="form-checkbox" />
        <icon-cartao-credito-servico class="w-7" />
        <label for="cartao_credito" class="mb-0 text-xs">Cartão de Crédito</label>
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
</template>
