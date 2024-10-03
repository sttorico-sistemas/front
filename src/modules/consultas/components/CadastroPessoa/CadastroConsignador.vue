<script lang="ts" setup>
// Core
import { reactive, ref, onMounted, inject } from 'vue'

// Props
const props = defineProps({
  matricula: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: true,
  }
})

// Componentes
import titulo from '@/core/components/Titulo.vue'
import LabelInput from '@/core/components/Inputs/InputLabel.vue'
import LabelSelect from 'src/core/components/Inputs/SelectLabel.vue'

import ConsultasCadastroPessoaContato from './CadastroPessoaContato.vue'
import ConsultasCadastroPessoaEndereco from './CadastroPessoaEndereco.vue'
import ConsultasCadastroPessoaMatricula from './CadastroMatricula.vue'

// Icons
import IconEdit from '@/core/components/Icons/IconEdit.vue'

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
    <div class="panel mt-5 border border-primary_3-table">
      <div class="flex items-center gap-14 mb-6">
        <titulo title="Cadastro Pessoa" />
        <button v-if="props.disabled" @click="isDisabled = false" v-tippy:right>
          <icon-edit />
        </button>
        <tippy v-if="props.disabled" target="right" placement="right">Editar cadastro</tippy>
      </div>

      <div class="panel">
        <titulo title="Dados da Pessoa" class="mb-6" />
        <div class="flex flex-col md:flex-row gap-2.5">
          <label-input type="cpf" id="cpf" label="CPF" :disabled="isDisabled" class-label="text-sm"
            class-input="md:max-w-[150px]" layout="row" />
          <label-input id="nome" label="Nome" :disabled="isDisabled" class-label="text-sm"
            class-input="md:min-w-[400px]" layout="row" />
          <label-input id="vinculo" label="Vínculo" :disabled="isDisabled" class-label="text-sm"
            class-input="md:max-w-[200px]" layout="row" />
          <label-input id="contratante" label="Contratante" :disabled="isDisabled" class-label="text-sm"
            class-input="md:w-[300px]" layout="row" />
        </div>
      </div>

      <consultas-cadastro-pessoa-contato />

      <consultas-cadastro-pessoa-endereco />

      <consultas-cadastro-pessoa-matricula v-if="matricula" />

      <div class="flex justify-center items-center gap-12 mt-8">
        <button type="button"
          class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
          @click="emits('btnCancelar', false)">Cancelar</button>
        <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs">Salvar</button>
      </div>
    </div>
  </main>
</template>
