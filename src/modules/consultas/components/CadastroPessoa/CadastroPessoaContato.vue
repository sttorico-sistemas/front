<script lang="ts" setup>
// Core
import { reactive, ref, inject } from 'vue'

// Componentes
import titulo from 'src/core/components/Titulo.vue'

import LabelInput from 'src/core/components/Inputs/InputLabel.vue'
import LabelSelect from 'src/core/components/Inputs/SelectLabel.vue'

// Icons
import IconAdd from 'src/core/components/Icons/IconAdd.vue'
import IconClose from 'src/core/components/Icons/IconClose.vue'

// Declarações
const eventBus = inject('eventBus')
const isDisabled = ref<boolean>(false)
const contatos = reactive([
  {
    tipoContato: '',
    telefone: '',
    celular: '',
    email: '',
  }
])

// Script
const addContato = () => {
  if (contatos.length >= 3) {
    eventBus.emit('alert', {
      type: 'danger',
      message: 'Limite máximo de contato é de 3'
    })

    return false
  }

  if (!contatos[0].celular.length && !contatos[0].email.length) {
    eventBus.emit('alert', {
      type: 'danger',
      message: 'Preencha os campos obrigatórios!'
    })

    return false
  }

  contatos.push({
    tipoContato: '',
    telefone: '',
    celular: '',
    email: '',
  })
}

const removeContato = (index: number) => {
  if (contatos.length === 1) {
    eventBus.emit('alert', {
      type: 'danger',
      message: 'Não foi possivel remover contato'
    })
    return false
  }

  contatos.splice(index, 1)
}
</script>
<template>
  <div class="panel my-3">
    <titulo title="Contatos" class="mb-6" />

    <div v-for="(contato, id) in contatos" :key="`contato-${id}`" class="flex-col md:flex-row flex gap-2.5 mb-3">
      <label-select id="tp_contrato" label="Tipo Contrato" :disabled="isDisabled" class-label="text-sm"
        class-select="md:w-[200px]" layout="row" :options="['Amigo', 'Familia', 'Trabalho', 'Vizinho', 'Casa']" />
      <label-input v-model="contato.telefone" type="tel" id="telefone" label="Telefone" :disabled="isDisabled"
        class-label="text-sm" class-input="md:max-w-[150px]" layout="row" />
      <label-input v-model="contato.celular" type="cel" id="celular" label="Celular" :disabled="isDisabled"
        class-label="text-sm" class-input="md:max-w-[150px]" layout="row" />
      <label-input v-model="contato.email" id="email" label="E-mail" :disabled="isDisabled" class-label="text-sm"
        class-input="md:w-[400px]" layout="row" />
      <div class="flex items-center gap-1">
        <button @click="addContato(contato, contatos)" v-tippy:right class="flex self-end mb-2">
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
