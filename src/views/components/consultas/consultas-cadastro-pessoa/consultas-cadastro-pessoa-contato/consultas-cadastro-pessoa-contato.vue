<script lang="ts" setup>
  // Core
  import { ref } from 'vue'

  // Componentes
  import titulo from '@components/layout/tituloLayout.vue'

  import LabelInput from '@components/layout/forms/inputs/inputLabel.vue'
  import LabelSelect from '@components/layout/forms/inputs/selectLabel.vue'

  // Icons

  // Declarações
  const isDisabled = ref<boolean>(false)

  // Script
  const emits = defineEmits(['btnSave', 'btnCancelar'])
</script>
<template>
  <div class="panel my-3">
    <titulo title="Dados do Contato" class="mb-6" />
    <label-select
      id="tp_contrato"
      label="Tipo Contrato"
      class-label="text-sm"
      class-select="md:max-w-[200px]"
      layout="col"
      :options="['Amigo', 'Familia', 'Trabalho', 'Vizinho', 'Casa']"
    />
    <label-input
      type="tel"
      id="telefone"
      label="Telefone"
      class-label="text-sm"
      class-input="md:max-w-[200px]"
      layout="col"
    />
    <label-input
      type="cel"
      id="celular"
      label="Celular"
      class-label="text-sm"
      class-input="md:max-w-[200px]"
      layout="col"
    />
    <label-input
      id="email"
      label="E-mail"
      class-label="text-sm"
      class-input="md:w-[400px]"
      layout="col"
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
