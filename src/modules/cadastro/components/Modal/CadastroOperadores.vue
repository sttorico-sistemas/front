<script lang="ts" setup>
// Props
defineProps({
  // TODO Refatorar para deixar como obrigátorio, passando o tipo também na tela de consignante
  typeScreen: {
    type: String,
    default: 'consignante'
  }
})

// Componentes
import LabelInput from '@/core/components/Inputs/InputLabel.vue'
import LabelSelect from 'src/core/components/Inputs/SelectLabel.vue'

// Script
const emits = defineEmits(['btnSave', 'btnCancelar'])
</script>

<template>
  <main>
    <div class="panel mt-5 border border-primary_3-table">
      <label class="text-sm md:text-base text-primary_3-table m-0 mb-3">Dados do Operador</label>

      <label-input id="nome" label="Nome" class-label="text-sm" class-input="md:max-w-[400px] mb-3" layout="row" />

      <label-select id="perfil" label="Perfil" class-label="text-sm" class-select="w-full md:max-w-[400px] mb-3"
        layout="row" :options="['consignante 1', 'consignante 2']" />

      <label-select id="departamento" label="Departamento" class-label="text-sm"
        class-select="w-full md:max-w-[400px] mb-3" layout="row" :options="['departamento 1', 'departamento 2']" />

      <div class="flex justify-start items-center gap-4 mb-3">
        <label-input id="telefone" label="Telefone" type="tel" class-label="text-sm" class-input="md:max-w-[150px]"
          layout="row" />
        <label-input id="celular" label="Celular" type="cel" class-label="text-sm" class-input="md:max-w-[150px]"
          layout="row" />
      </div>
      <label-input id="email" label="E-mail" class-label="text-sm" class-input="md:max-w-[400px] mb-3" layout="row" />
      <div class="flex justify-start items-center gap-4">
        <label-input type="date" id="data_inicial" label="Data Inicial" class-label="text-sm"
          class-input="md:max-w-[150px]" layout="row" />
        <label-input type="date" id="data_final" label="Data Final" class-label="text-sm" class-input="md:max-w-[150px]"
          layout="row" />
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
