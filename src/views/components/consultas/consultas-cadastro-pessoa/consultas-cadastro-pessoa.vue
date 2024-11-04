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
  import titulo from '@components/layout/tituloLayout.vue'
  import LabelInput from '@components/layout/forms/inputs/inputLabel.vue'
  import LabelSelect from '@components/layout/forms/inputs/selectLabel.vue'

  import consultasListagemContatos from './consultas-listagem-contatos/consultas-listagem-contatos.vue';
  import consultasListagemEnderecos from './consultas-listagem-enderecos/consultas-listagem-enderecos.vue';

  // Icons
  import IconEdit from '@icons/iconEdit.vue'

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
      <div class="panel">
        <titulo title="Dados da Pessoa" class="mb-6" />
        <div>
          <div class="flex flex-col md:flex-row gap-5 mb-3">
            <label-input
              type="cpf"
              id="cpf"
              label="CPF"
              class-label="text-sm"
              class-input="md:max-w-[200px]"
              layout="row"
              />
            <label-input
              type="date"
              id="nascimento"
              label="Data Nascimento"
              class-label="text-sm"
              class-input="md:max-w-[200px]"
              layout="row"
            />
            <label-select
              id="vinculo"
              label="Tipo Vínculo"
              class-label="text-sm"
              class-select="md:w-[200px]"
              layout="row"
              :options="['Analista', 'vendedor', 'Gerente', 'Aprovador']"
            />
          </div>
          <div>
            <label-input
              type="text"
              id="nome"
              label="Nome"
              class-label="text-sm"
              class-input="md:max-w-[600px]"
              layout="row"
            />
          </div>
        </div>
      </div>

      <consultas-listagem-contatos />

      <consultas-listagem-enderecos />

      <div class="flex justify-center items-center gap-12 mt-8">
        <button
          type="button"
          class="w-[86px] btn border border-primary_3-table shadow-none text-primary_3-table text-xs"
          @click="emits('btnCancelar', false)"
        >Cancelar</button>
        <button type="button" class="w-[86px] btn bg-primary_3-table text-white text-xs">Salvar</button>
      </div>
    </div>
	</main>
</template>
