<script lang="ts" setup>
  // Core
  import { reactive, ref, onMounted } from 'vue'

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

  // Icons
  import IconAdd from '@icons/iconAdd.vue'
  import IconEdit from '@icons/iconEdit.vue'
  import IconClose from '@icons/iconClose.vue'

	// Declarações
  const isDisabled = ref<boolean>(true)
  const contatos = reactive([
    {
      tipoContato: '',
      telefone: '',
      celular: '',
      email: '',
    }
  ])
  const enderecos = reactive([
    {
      tipoEndereco: '',
      endereco: '',
      cidade: '',
      uf: '',
    }
  ])

	// Script
  const addContato = () => {
    if (contatos.length >= 3) return false // adicionar mensagem que o máximo é 3 contatos
    if (!contatos[0].celular.length && !contatos[0].email.length) return false // adicionar mensagem que deve ser preenchido

    contatos.push({
      tipoContato: '',
      telefone: '',
      celular: '',
      email: '',
    })
  }

  const removeContato = (index: number) => {
    if (contatos.length === 1) return false // adicionar mensagem que não pode excluir

    contatos.splice(index, 1)
  }

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
        <button
          v-if="props.disabled"
          @click="isDisabled = false"
          v-tippy:right
        >
          <icon-edit />
        </button>
        <tippy v-if="props.disabled" target="right" placement="right"
          >Editar cadastro</tippy
        >
      </div>

      <div class="panel">
        <titulo title="Dados da Pessoa" class="mb-6" />
        <div class="flex flex-col md:flex-row gap-2.5">
          <label-input
            type="cpf"
            id="cpf"
            label="CPF"
            :disabled="isDisabled"
            class-label="text-sm"
            class-input="md:max-w-[150px]"
            layout="row"
          />
          <label-input
            id="nome"
            label="Nome"
            :disabled="isDisabled"
            class-label="text-sm"
            class-input="md:min-w-[400px]"
            layout="row"
          />
          <label-input
            id="vinculo"
            label="Vínculo"
            :disabled="isDisabled"
            class-label="text-sm"
            class-input="md:max-w-[200px]"
            layout="row"
          />
          <label-input
            id="contratante"
            label="Contratante"
            :disabled="isDisabled"
            class-label="text-sm"
            class-input="md:w-[300px]"
            layout="row"
          />
        </div>
      </div>

      <div class="panel my-3">
        <div class="flex items-center gap-14 mb-6">
					<titulo title="Contatos" />
				</div>
        <div
          v-for="(contato, id) in contatos"
          :key="id"
          class="flex-col md:flex-row flex gap-2.5 mb-3"
        >
          <label-select
            id="tp_contrato"
            label="Tipo Contrato"
            :disabled="isDisabled"
            class-label="text-sm"
            class-select="md:w-[200px]"
            layout="row"
            :options="['Amigo', 'Familia', 'Trabalho', 'Vizinho', 'Casa']"
          />
          <label-input
            v-model="contato.telefone"
            type="tel"
            id="telefone"
            label="Telefone"
            :disabled="isDisabled"
            class-label="text-sm"
            class-input="md:max-w-[150px]"
            layout="row"
          />
          <label-input
            v-model="contato.celular"
            type="cel"
            id="celular"
            label="Celular"
            :disabled="isDisabled"
            class-label="text-sm"
            class-input="md:max-w-[150px]"
            layout="row"
          />
          <label-input
            v-model="contato.email"
            id="email"
            label="E-mail"
            :disabled="isDisabled"
            class-label="text-sm"
            class-input="md:w-[400px]"
            layout="row"
          />
          <div class="flex items-center gap-1">
            <button @click="addContato(contato, contatos)" v-tippy:right class="flex self-end mb-2">
              <icon-add />
            </button>
            <button @click="removeContato(index)"  class="flex self-end mb-2">
              <icon-close />
            </button>
            <tippy target="right" placement="right">Cadastre um novo Contato</tippy>
          </div>
        </div>
      </div>

      <div class="panel my-3">
        <div class="flex items-center gap-14 mb-6">
					<titulo title="Endereços" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right"
						>Cadastre um novo Endereço</tippy
					>
				</div>
        <div class="flex-col md:flex-row flex gap-2.5">
           <label-select
            id="tipo_endereco"
            label="Tipo Endereço"
            :disabled="isDisabled"
            class-label="text-sm"
            class-select="md:w-[200px]"
            layout="row"
            :options="['Rua', 'Comunidade', 'Condominio']"
          />
          <label-input
            id="endereco"
            label="Endereço"
            :disabled="isDisabled"
            class-label="text-sm"
            class-input="md:min-w-[545px]"
            layout="row"
          />
          <label-input
            id="cidade"
            label="Cidade"
            :disabled="isDisabled"
            class-label="text-sm"
            class-input="md:max-w-[300px]"
            layout="row"
          />
           <label-select
            id="uf"
            label="UF"
            :disabled="isDisabled"
            class-label="text-sm"
            class-select="md:w-[70px]"
            layout="row"
            :options="['SP', 'RJ', 'MG', 'ES']"
          />
          <button @click="isOpenDialog = true" v-tippy:right class="flex self-end mb-2">
						<icon-close />
					</button>
        </div>
      </div>

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
