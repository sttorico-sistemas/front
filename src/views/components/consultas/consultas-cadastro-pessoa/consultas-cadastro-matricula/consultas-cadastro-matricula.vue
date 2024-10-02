<script lang="ts" setup>
// Core
import { reactive, ref, onMounted, inject } from 'vue'

// Props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: true,
  }
})

// Componentes
import titulo from '@/core/components/layout/tituloLayout.vue'
import LabelInput from '@/core/components/layout/forms/inputs/inputLabel.vue'
import LabelSelect from '@/core/components/layout/forms/inputs/selectLabel.vue'

import ConsultasCadastroPessoaContato from './consultas-cadastro-pessoa-contato/consultas-cadastro-pessoa-contato.vue'
import ConsultasCadastroPessoaEndereco from './consultas-cadastro-pessoa-endereco/consultas-cadastro-pessoa-endereco.vue'

// Icons
import IconEdit from '@/core/components/icons/iconEdit.vue'

// Declarações
const isDisabled = ref<boolean>(true)

// Script

const emits = defineEmits(['btnSave', 'btnCancelar'])

onMounted(() => {
  isDisabled.value = props.disabled
})
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
