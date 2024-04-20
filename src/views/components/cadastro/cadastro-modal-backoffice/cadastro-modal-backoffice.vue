<script lang="ts" setup>
  // Core
  import { reactive, ref } from 'vue'

  // Props

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
      <label class="text-sm md:text-base text-primary_3-table m-0 mb-3">Dados do Backoffice</label>

      <label-input
        id="nome"
        label="Nome"
        class-label="text-sm"
        class-input="md:max-w-[400px] mb-3"
        layout="row"
      />

      <label-select
        id="setor"
        label="Setor"
        class-label="text-sm"
        class-select="w-full md:max-w-[400px] mb-3"
        layout="row"
        :options="[]"
      />

      <div class="flex justify-start items-center gap-2.5">
        <label-select
          id="cidade"
          label="Cidade"
          class-label="text-sm"
          class-select="w-full md:min-w-[300px] mb-3"
          layout="row"
          :options="['Rio de Janeiro']"
        />
        <label-select
          id="uf"
          label="UF"
          class-label="text-sm"
          class-select="w-full md:min-w-[100px] mb-3"
          layout="row"
          :options="['RJ']"
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
