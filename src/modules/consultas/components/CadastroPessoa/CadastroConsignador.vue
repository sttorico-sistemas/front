<script lang="ts" setup>
import { ref } from 'vue'
import titulo from 'src/core/components/Titulo.vue'
import LabelInput from 'src/core/components/Inputs/InputLabel.vue'
import ConsultasCadastroPessoaContato from './CadastroPessoaContato.vue'
import ConsultasCadastroPessoaEndereco from './CadastroPessoaEndereco.vue'
import ConsultasCadastroPessoaMatricula from './CadastroMatricula.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'

const props = withDefaults(defineProps<{
  matricula?: boolean;
  disabled?: boolean;
}>(), {
  disabled: true,
  matricula: true,
})

const isDisabled = ref(props.disabled)

const emits = defineEmits(['btnSave', 'btnCancelar'])
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
