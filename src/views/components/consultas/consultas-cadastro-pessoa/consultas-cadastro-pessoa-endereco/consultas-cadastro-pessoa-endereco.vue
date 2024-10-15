<script lang="ts" setup>
  // Core

  // Componentes
  import titulo from '@components/layout/tituloLayout.vue'

  import LabelInput from '@components/layout/forms/inputs/inputLabel.vue'
  import LabelSelect from '@components/layout/forms/inputs/selectLabel.vue'

  // Icons

  // Declarações

  // Script
  const emits = defineEmits(['btnSave', 'btnCancelar'])
</script>
<template>
  <div class="panel my-3">
    <titulo title="Dados do Endereço" class="mb-6" />
    <label-select
      id="tipo_endereco"
      label="Tipo Endereço"
      class-label="text-sm"
      class-select="md:max-w-[200px]"
      layout="col"
      :options="['Rua', 'Comunidade', 'Condominio']"
    />
    <label-input
      id="endereco"
      label="Endereço"
      class-label="text-sm"
      class-input="md:max-w-[400px]"
      layout="col"
    />
    <label-input
      id="bairro"
      label="Bairro"
      class-label="text-sm"
      class-input="md:max-w-[300px]"
      layout="col"
    />
    <label-select
      id="uf"
      label="UF"
      class-label="text-sm"
      class-select="md:max-w-[70px]"
      layout="col"
      :options="['SP', 'RJ', 'MG', 'ES']"
    />
    <label-select
      id="cidade"
      label="Cidade"
      class-label="text-sm"
      class-select="md:max-w-[200px]"
      layout="col"
      :options="['Rio de Janeiro']"
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
</template>
