<script lang="ts" setup>
import titulo from 'src/core/components/Titulo.vue'
import LabelInput from 'src/core/components/Inputs/InputLabel.vue'
import LabelSelect from 'src/core/components/Inputs/SelectLabel.vue'

const emits = defineEmits(['btnSave', 'btnCancelar'])
</script>

<template>
  <div class="panel mb-2">
    <div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
      <titulo title="Dados da Consignação" />
    </div>

    <form class="">
      <label-input id="consignante" value="" label="Consignante" class-label="text-sm sm:w-2/5 "
        class-input="md:min-w-[288px] mb-2.5 text-xs font-normal disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
        class-wrapper="w-full md:min-w-[288px]" layout="col" disabled />
      <label-select id="consignante_master" label="Grupo de Serviços:" class-label="text-sm md:w-2/5 md:w-2/5"
        class-select="w-full md:w-[288px] mb-2.5" layout="col" :options="['consignante 1', 'consignante 2']" />
      <label-select id="consignante_master" label="Classe:" class-label="text-sm md:w-2/5"
        class-select="w-full md:w-[288px] mb-2.5" layout="col" :options="['consignante 1', 'consignante 2']" />
      <label-select id="consignante_master" label="Tipo Consignação:" class-label="text-sm md:w-2/5"
        class-select="w-full md:w-[288px] mb-2.5" layout="col" :options="['consignante 1', 'consignante 2']" />
      <label-select id="consignante_master" label="Prazo do Acordo:" class-label="text-sm md:w-2/5"
        class-select="w-full md:w-[288px] mb-2.5" layout="col" :options="['consignante 1', 'consignante 2']" />
      <label-select id="consignante_master" label="Tipo Desconto:" class-label="text-sm md:w-2/5"
        class-select="w-full md:w-[288px] mb-2.5" layout="col" :options="['consignante 1', 'consignante 2']" />
      <label-select id="consignante_master" label="Grupo Margem:" class-label="text-sm md:w-2/5"
        class-select="w-full md:w-[288px] mb-2.5" layout="col" :options="['consignante 1', 'consignante 2']" />
      <label-input type="date" id="data_inicial" label="Data Inicial:" class-label="text-sm md:w-2/5"
        class-input="md:max-w-[150px]" layout="col" />
    </form>
  </div>

  <div class="flex justify-center items-center gap-12 mt-8">
    <button type="button" class="w-[86px] btn border border-primary shadow-none text-primary text-xs"
      @click="emits('btnCancelar', false)">Cancelar</button>
    <button type="button" class="w-[86px] btn bg-primary text-white text-xs">Salvar</button>
  </div>
</template>
