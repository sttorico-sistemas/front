<script lang="ts" setup>
// Componentes
import titulo from '@/core/components/Titulo.vue'
import LabelInput from '@/core/components/Inputs/InputLabel.vue'

// Icones
import IconDoc from '@/core/components/icons/iconFile.vue'

// Scripts
const emits = defineEmits(['btnSave', 'btnCancelar'])
</script>
<template>
  <div class="panel mb-2">
    <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
      <titulo title="Anotação" />
    </div>

    <form class="">
      <label-input id="consignante" value="" label="Consignante" class-label="text-sm sm:w-2/5 "
        class-input="md:min-w-[288px] mb-2.5 text-xs font-normal disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
        class-wrapper="w-full md:min-w-[288px]" layout="row" disabled />
      <label-input id="titulo" label="Título" class-label="text-sm" class-input="md:max-w-full" layout="row" />
      <div class="mt-2.5">
        <label for="nota" class="text-sm">Nota:</label>
        <textarea id="nota" rows="3" class="form-textarea text-xs font-normal md:max-w-full h-[95px]"></textarea>
      </div>
      <div class="flex flex-col justify-between md:flex-row gap-4 items-center mt-2.5">
        <label for="anexar-documento" class="flex gap-2 cursor-pointer">
          <icon-doc />
          <span class="text-primary_3-table text-sm">
            Anexar Documento (pdf)
          </span>
          <input type="file" id="anexar-documento" class="hidden" accept="application/pdf">
        </label>
      </div>
    </form>
  </div>

  <div class="flex justify-center items-center gap-12 mt-8">
    <button type="button" class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
      @click="emits('btnCancelar', false)">Cancelar</button>
    <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs">Salvar</button>
  </div>
</template>
