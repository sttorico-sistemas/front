<script lang="ts" setup>
import { reactive, ref, inject, onMounted } from 'vue'
import titulo from 'src/core/components/Titulo.vue'
import LabelInput from 'src/core/components/Inputs/InputLabel.vue'
import LabelSelect from 'src/core/components/Inputs/SelectLabel.vue'
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconClose from 'src/core/components/Icons/IconClose.vue'
import { Emitter, EventType } from 'mitt'
import { TableValue } from 'src/modules/configuracoes/types/table_value'
import { tabelasAuxiliaresStore } from 'src/modules/configuracoes/stores/tabelas_auxiliares.store'

const store = tabelasAuxiliaresStore();

const eventBus = inject<Emitter<Record<EventType, unknown>>>('eventBus')
const isDisabled = ref(false)

const contactTypes = ref<TableValue[]>([]);

const contacts = reactive([
  {
    contactType: '',
    telefone: '',
    celular: '',
    email: '',
  }
])

const addContato = () => {
  if (contacts.length >= 3) {
    eventBus?.emit('alert', {
      type: 'danger',
      message: 'Limite máximo de contato é de 3'
    })

    return false
  }

  if (!contacts[0].celular.length && !contacts[0].email.length) {
    eventBus?.emit('alert', {
      type: 'danger',
      message: 'Preencha os campos obrigatórios!'
    })

    return false
  }

  contacts.push({
    contactType: '',
    telefone: '',
    celular: '',
    email: '',
  })
}

const removeContato = (index: number) => {
  if (contacts.length === 1) {
    eventBus?.emit('alert', {
      type: 'danger',
      message: 'Não foi possivel remover contato'
    })
    return false
  }

  contacts.splice(index, 1);
}

onMounted(async () => {
  isDisabled.value = true;
  const contactTypesResponse = await store.getValues('tipo-contato');
  contactTypes.value = contactTypesResponse;
  isDisabled.value = false;
});
</script>
<template>
  <div class="panel my-3">
    <titulo title="Contatos" class="mb-6" />

    <div v-for="(contato, index) in contacts" :key="`contato-${index}`" class="flex-col md:flex-row flex gap-2.5 mb-3">
      <label-select id="tp_contrato" label="Tipo Contrato" :disabled="isDisabled" class-label="text-sm"
        class-select="md:w-[200px]" layout="row" :options="contactTypes.map((e) => e.nome)" />
      <label-input v-model="contato.telefone" type="tel" id="telefone" label="Telefone" :disabled="isDisabled"
        class-label="text-sm" class-input="md:max-w-[150px]" layout="row" />
      <label-input v-model="contato.celular" type="cel" id="celular" label="Celular" :disabled="isDisabled"
        class-label="text-sm" class-input="md:max-w-[150px]" layout="row" />
      <label-input v-model="contato.email" id="email" label="E-mail" :disabled="isDisabled" class-label="text-sm"
        class-input="md:w-[400px]" layout="row" />
      <div class="flex items-center gap-1">
        <button @click="addContato()" v-tippy:right class="flex self-end mb-2">
          <icon-add />
        </button>
        <button @click="removeContato(index)" class="flex self-end mb-2">
          <icon-close />
        </button>
        <tippy target="right" placement="right">Cadastre um novo Contato</tippy>
      </div>
    </div>
  </div>
</template>
