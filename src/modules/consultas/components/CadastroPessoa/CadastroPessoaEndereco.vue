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
const enderecos = reactive([
  {
    tipoEndereco: '',
    endereco: '',
    cidade: '',
    uf: '',
  }
])

// Script
const addEndereco = () => {
  if (enderecos.length >= 3) {
    eventBus.emit('alert', {
      type: 'danger',
      message: 'Limite máximo de contato é de 3'
    })

    return false
  }

  if (!enderecos[0].endereco.length && !enderecos[0].cidade.length) {
    eventBus.emit('alert', {
      type: 'danger',
      message: 'Preencha os campos obrigatórios!'
    })

    return false
  }

  enderecos.push({
    tipoEndereco: '',
    endereco: '',
    cidade: '',
    uf: '',
  })
}

const removeEndereco = (index: number) => {
  if (enderecos.length === 1) {
    eventBus.emit('alert', {
      type: 'danger',
      message: 'Não foi possivel remover contato'
    })
    return false
  }

  enderecos.splice(index, 1)
}
</script>
<template>
  <div class="panel my-3">
    <titulo title="Endereços" class="mb-6" />

    <div v-for="(endereco, id) in enderecos" :key="`endereco-${id}`" class="flex-col md:flex-row flex gap-2.5">
      <label-select id="tipo_endereco" label="Tipo Endereço" :disabled="isDisabled" class-label="text-sm"
        class-select="md:w-[200px]" layout="row" :options="['Rua', 'Comunidade', 'Condominio']" />
      <label-input v-model="endereco.endereco" id="endereco" label="Endereço" :disabled="isDisabled"
        class-label="text-sm" class-input="md:min-w-[545px]" layout="row" />
      <label-input v-model="endereco.cidade" id="cidade" label="Cidade" :disabled="isDisabled" class-label="text-sm"
        class-input="md:max-w-[300px]" layout="row" />
      <label-select id="uf" label="UF" :disabled="isDisabled" class-label="text-sm" class-select="md:w-[70px]"
        layout="row" :options="['SP', 'RJ', 'MG', 'ES']" />
      <div class="flex items-center gap-1">
        <button @click="addEndereco(endereco, enderecos)" v-tippy:right class="flex self-end mb-2">
          <icon-add />
        </button>
        <button @click="removeEndereco(index)" class="flex self-end mb-2">
          <icon-close />
        </button>
        <tippy target="right" placement="right">Cadastre um novo Endereco</tippy>
      </div>
    </div>
  </div>
</template>
