<script lang="ts" setup>
// Componentes
import titulo from '@/core/components/layout/tituloLayout.vue'
import LabelInput from '@/core/components/layout/forms/inputs/inputLabel.vue'
import LabelSelect from '@/core/components/layout/forms/inputs/selectLabel.vue'

// Icones
import IconDoc from '@/core/components/icons/iconFile.vue'

// Scripts
const emits = defineEmits(['btnSave', 'btnCancelar'])

const color = (value: string): string => {
  switch (value) {
    case 'Ativo':
      return 'bg-success' // Ativo
    case 'Liberada':
      return 'bg-success'
    case 'Inativo':
      return 'bg-warning' // Inativo
    case 'Bloqueada':
      return 'bg-secondary'
    default:
      return 'bg-secondary'
  }
}
</script>
<template>
  <div class="panel mb-2">
    <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
      <titulo title="Dados do Normativo" />
    </div>

    <form class="">
      <label-input id="consignante" value="" label="Consignante" class-label="text-sm"
        class-input="md:max-w-[400px] mb-3 text-xs font-normal disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
        class-wrapper="w-full md:min-w-[400px]" layout="row" disabled />
      <div class="flex flex-col md:flex-row gap-4 items-center my-2.5">
        <label-select id="consignante_master" label="Tipo Normativo" class-label="text-sm"
          class-select="w-full md:w-[200px]" layout="row" :options="['consignante 1', 'consignante 2']" />
        <label-select id="consignante" label="Número" class-label="text-sm" class-wrapper="w-full md:w-[150px]"
          layout="row" :options="['consignante 1', 'consignante 2']" />
        <label-input type="date" id="data_inicial" label="Data Inicial" class-label="text-sm"
          class-input="md:max-w-[150px]" layout="row" />
      </div>
      <label-input id="objeto" label="Objeto" type="text" class-wrapper="w-full md:w-[400px]" class-label="text-sm"
        class-input="text-xs font-normal" value="" />
      <div class="mt-2.5">
        <label for="assunto" class="text-sm">Assunto</label>
        <textarea id="assunto" rows="3" class="form-textarea text-xs font-normal md:max-w-[538px] h-[95px]"></textarea>
      </div>
      <div class="flex flex-col justify-between md:flex-row gap-4 items-center mt-8">
        <label for="anexar-documento" class="flex gap-2 cursor-pointer">
          <icon-doc />
          <span class="text-primary_3-table text-sm">
            Anexar Documento (pdf)
          </span>
          <input type="file" id="anexar-documento" class="hidden" accept="application/pdf">
        </label>
        <div class="flex items-center gap-3">
          <span class="text-[10px]">Status:</span>
          <div class="flex justify-center badge !w-[80px] h-[22px]" :class="color('Ativo')">Ativo</div>
        </div>
      </div>
    </form>
  </div>

  <div class="panel">
    <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
      <titulo title="Dados da Revogação" />
    </div>

    <form class="">
      <label-input type="date" id="data_final" label="Data Final" class-label="text-sm" class-input="md:max-w-[150px]"
        layout="row" />
      <label-input id="observacao" label="Observação" type="text" class-wrapper="w-full" class-label="text-sm mt-2.5"
        class-input="text-xs font-normal" value="" />
    </form>
  </div>

  <div class="flex justify-center items-center gap-12 mt-8">
    <button type="button" class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
      @click="emits('btnCancelar', false)">Cancelar</button>
    <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs">Salvar</button>
  </div>
</template>
