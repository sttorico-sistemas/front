<script lang="ts" setup>
  // Core
  import { reactive, ref } from 'vue'

	// Componentes
  import titulo from '@components/layout/tituloLayout.vue'

  import LabelInput from '@components/layout/forms/inputs/inputLabel.vue'
  import LabelSelect from '@components/layout/forms/inputs/selectLabel.vue'

  // Icons
  import IconAdd from '@icons/iconAdd.vue'
  import IconEdit from '@icons/iconEdit.vue'
  import IconClose from '@icons/iconClose.vue'

	// Declarações
  const isDisabled = ref(true)

	// Script

  const emits = defineEmits(['btnSave', 'btnCancelar'])

</script>
<template>
	<main>
    <div class="panel mt-5 border border-primary_3-table">
      <div class="flex items-center gap-14 mb-6">
        <titulo title="Cadastro Pessoa" />
        <button @click="isDisabled = false" v-tippy:right>
          <icon-edit />
        </button>
        <tippy target="right" placement="right"
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
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right"
						>Cadastre uma nova pessoa</tippy
					>
				</div>
        <div class="flex-col md:flex-row flex gap-2.5">
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
            type="tel"
            id="telefone"
            label="Telefone"
            :disabled="isDisabled"
            class-label="text-sm"
            class-input="md:max-w-[150px]"
            layout="row"
          />
          <label-input
            type="cel"
            id="celular"
            label="Celular"
            :disabled="isDisabled"
            class-label="text-sm"
            class-input="md:max-w-[150px]"
            layout="row"
          />
          <label-input
            id="email"
            label="E-mail"
            :disabled="isDisabled"
            class-label="text-sm"
            class-input="md:w-[400px]"
            layout="row"
          />
          <button @click="isOpenDialog = true" v-tippy:right class="flex self-end mb-2">
						<icon-close />
					</button>
        </div>
      </div>

      <div class="panel my-3">
        <div class="flex items-center gap-14 mb-6">
					<titulo title="Endereços" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right"
						>Cadastre uma nova pessoa</tippy
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
