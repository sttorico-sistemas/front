<script lang="ts" setup>
import { reactive, ref } from 'vue'
import titulo from 'src/core/components/Titulo.vue'
import LabelInput from 'src/core/components/Inputs/InputLabel.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import CadastroEndereco from '../CadastroEndereco.vue';
import CadastroContato from '../CadastroContato.vue';
import { pessoaStore } from '../../stores/pessoa.store';
import FormField from 'src/core/components/FormField.vue';
import { Person } from '../../types/pessoa';

const props = withDefaults(defineProps<{
  disabled?: boolean;
}>(), {
  disabled: true,
});

const store = pessoaStore();

const isDisabled = ref(props.disabled)
const emits = defineEmits(['btnSave', 'btnCancelar'])

const pessoa = ref({
  name: '',
  cpf: '',
  addresses: [],
  contacts: [],
  contratante: '',
  vinculo: '',
});
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
          <form-field :disabled="isDisabled" v-model="pessoa.cpf" max-width="150px" label="CPF" />
          <form-field :disabled="isDisabled" v-model="pessoa.name" min-width="400px" label="Nome" />
          <form-field :disabled="isDisabled" v-model="pessoa.vinculo" max-width="200px" label="Vínculo" />
          <form-field :disabled="isDisabled" v-model="pessoa.contratante" width="300px" label="Contratante" />
        </div>
      </div>

      <cadastro-contato v-model="pessoa.contacts" />
      <cadastro-endereco v-model="pessoa.addresses" />

      <div class="flex justify-center items-center gap-12 mt-8">
        <button type="button"
          class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
          @click="emits('btnCancelar', false)">Cancelar</button>
        <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs">Salvar</button>
      </div>
    </div>
  </main>
</template>
