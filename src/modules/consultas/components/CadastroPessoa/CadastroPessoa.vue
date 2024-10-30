<script lang="ts" setup>
import { ref } from 'vue'
import titulo from 'src/core/components/Titulo.vue'
import IconEdit from 'src/core/components/Icons/IconEdit.vue'
import CadastroEndereco from '../CadastroEndereco.vue';
import CadastroContato from '../CadastroContato.vue';
import { pessoaStore } from '../../stores/pessoa.store';
import FormField from 'src/core/components/FormField.vue';
import AppButton from 'src/core/components/AppButton.vue';
import AppDialog from 'src/core/components/AppDialog.vue';

const props = withDefaults(defineProps<{
  disabled?: boolean;
}>(), {
  disabled: true,
});

const store = pessoaStore();

const isDisabled = ref(props.disabled)

const pessoa = ref({
  nome: '',
  cpf: '',
  enderecos: [],
  contatos: [],
  contratante: '',
  vinculo: '',
});
</script>

<template>
  <app-dialog max-width="100%" @update:model-value="store.toggleEditor($event)" :model-value="store.showEditor">
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
          <form-field :disabled="isDisabled" v-model="pessoa.nome" min-width="400px" label="Nome" />
          <form-field :disabled="isDisabled" v-model="pessoa.vinculo" max-width="200px" label="Vínculo" />
          <form-field :disabled="isDisabled" v-model="pessoa.contratante" width="300px" label="Contratante" />
        </div>
      </div>

      <cadastro-contato v-model="pessoa.contatos" />
      <cadastro-endereco v-model="pessoa.enderecos" />

      <div class="flex justify-center items-center gap-12 mt-8">
        <app-button width="86px" density="comfortable" variant="outlined" @click="store.toggleEditor()">
          Cancelar
        </app-button>
        <app-button width="86px" density="comfortable">
          Salvar
        </app-button>
      </div>
    </div>
  </app-dialog>
</template>
