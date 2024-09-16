<script lang="ts" setup>
  // Core
  import { reactive, ref } from 'vue'

  // Props
  const props = defineProps({
    // !TODO Refatorar para deixar como obrigátorio, passando o tipo também na tela de consignante
    typeScreen: {
      type: String,
      default: 'consignante'
    }
  })

	// Componentes
  import LabelInput from '@components/layout/forms/inputs/inputLabel.vue'
  import LabelSelect from '@components/layout/forms/inputs/selectLabel.vue'

	// Icons

	// Declarações

	// Script

  const emits = defineEmits(['btnSave', 'btnCancelar'])
</script>
<template>
	<main>
    <div class="panel mt-5 border border-primary_3-table">
      <label class="text-sm md:text-base text-primary_3-table m-0 mb-3">Dados do Contrato</label>

      <label-input
        v-if="props.typeScreen === 'consignataria'"
        id="cod_contrato"
        label="Cód.Contrato"
        class-label="text-sm"
        class-input="md:max-w-[200px] mb-3"
        layout="row"
      />

      <label-select
        v-if="props.typeScreen === 'consignataria'"
        id="consignante"
        label="Consignante"
        class-label="text-sm"
        class-select="w-full md:max-w-[400px] mb-3"
        layout="row"
        :options="['consignante 1', 'consignante 2']"
      />

      <label-select
        id="contrato"
        label="Tipo de Contrato"
        class-label="text-sm"
        class-select="w-full md:max-w-[400px] mb-3"
        layout="row"
        :options="['Contrato Comodato', 'Acordo de Cooperação Técnica']"
      />

      <div class="flex justify-start items-center gap-4">
        <label-input
          id="vigencia"
          label="Vigência"
          class-label="text-sm"
          class-input="md:max-w-[60px]"
          layout="row"
        />
        <label-input
          type="date"
          id="data_inicial"
          label="Data Inicial"
          class-label="text-sm"
          class-input="md:max-w-[150px]"
          layout="row"
        />
        <label-input
          type="date"
          id="data_final"
          label="Data Final"
          class-label="text-sm"
          class-input="md:max-w-[150px]"
          layout="row"
        />
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
