<script lang="ts" setup>
import titulo from 'src/core/components/Titulo.vue'
import LabelInput from 'src/core/components/Inputs/InputLabel.vue'
const emits = defineEmits(['btnSave', 'btnCancelar'])
</script>

<template>
  <main>
    <div class="panel">
      <titulo title="Matrículas" class="mb-6" />
      <div class="flex flex-col md:flex-row flex-wrap gap-2.5">
        <label-input id="matricula" label="Matrícula" class-label="text-sm" class-input="md:max-w-[200px]"
          layout="row" />
        <label-input id="consignante" label="Consignante" class-label="text-sm" class-input="md:min-w-[200px]"
          layout="row" />
        <label-input id="averbador" label="Averbador" class-label="text-sm" class-input="md:max-w-[200px]"
          layout="row" />
        <label-input id="categoria" label="Categoria" class-label="text-sm" class-input="md:w-[200px]" layout="row" />
        <label-input id="regime_contratacao" label="Regime de Contratação" class-label="text-sm"
          class-input="md:w-[200px]" layout="row" />
        <label-input id="status_funcional" label="Status Funcional" class-label="text-sm" class-input="md:w-[120px]"
          layout="row" />
        <label-input id="cargo" label="Cargo" class-label="text-sm" class-input="md:w-[200px]" layout="row" />
        <label-input id="unidade" label="Unidade" class-label="text-sm" class-input="md:w-[200px]" layout="row" />
        <label-input id="orgao" label="Órgão" class-label="text-sm" class-input="md:w-[200px]" layout="row" />
        <label-input id="lotacao" label="Lotação" class-label="text-sm" class-input="md:w-[200px]" layout="row" />
        <label-input id="admissao" label="Data Admissão" class-label="text-sm" class-input="md:w-[150px]"
          layout="row" />
        <label-input id="desligamento" label="Data Desligamento" class-label="text-sm" class-input="md:w-[150px]"
          layout="row" />
      </div>
    </div>
  </main>
</template>
