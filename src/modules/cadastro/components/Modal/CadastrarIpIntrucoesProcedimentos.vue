<script lang="ts" setup>
// Componentes
import titulo from 'src/core/components/Titulo.vue'
import LabelInput from 'src/core/components/Inputs/InputLabel.vue'
import LabelSelect from 'src/core/components/Inputs/SelectLabel.vue'

// Icones
import IconDoc from 'src/core/components/Icons/IconFile.vue'

// Scripts
const emits = defineEmits(['btnSave', 'btnCancelar'])
</script>
<template>
  <div class="panel mb-2">
    <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
      <titulo title="Dados do IP" />
    </div>

    <form class="">
      <label-select id="numero" label="Número" class-label="text-sm" class-select="w-full md:w-[150px]" layout="row"
        :options="['numero 1', 'numero 2']" />
      <label-input id="instrucoes" label="Instrução" class-label="text-sm" class-input="md:max-w-[400px]"
        layout="row" />
      <div class="flex flex-col md:flex-row gap-4 items-center my-2.5">
        <label-input type="date" id="data_inicial" label="Data Inicial" class-label="text-sm"
          class-input="md:max-w-[150px]" layout="row" />
        <label-input type="date" id="data_final" label="Data Final" class-label="text-sm" class-input="md:max-w-[150px]"
          layout="row" />
      </div>
      <div class="flex flex-col justify-between md:flex-row gap-4 items-center mt-8">
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
