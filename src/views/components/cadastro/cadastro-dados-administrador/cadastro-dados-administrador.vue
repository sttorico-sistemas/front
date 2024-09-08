<script lang="ts" setup>
  // Core
  import { reactive, ref } from 'vue'

	// Componentes
  import LabelInput from '@components/layout/forms/inputs/inputLabel.vue'
  import modalLayout from '@components/layout/modalLayout.vue'
	import titulo from '@components/layout/tituloLayout.vue'

  import CadastroModalAdministrador from '../cadastro-modal-administrador/cadastro-modal-administrador.vue'

	// Icons
  import IconEdit from '@icons/iconEdit.vue'

  import IconCartaoCreditoServico from '@icons/services/iconCartaoCreditoServico.vue'
	import IconEmprestimoServico from '@icons/services/iconEmprestimosServicos.vue'
	import IconMensalidadeServico from '@icons/services/iconMensalidadeServicos.vue'
	import IconPlanoSaudeServico from '@icons/services/iconPlanoSaudeServico.vue'
	import IconSegurosServico from '@icons/services/iconSegurosServico.vue'

	// Declarações
  const isOpenDialog = ref<boolean>(false)
  const isDisabled = ref<boolean>(true)

	// Script

</script>
<template>
	<main>
    <div class="panel mt-6">
      <div class="flex items-center gap-14">
        <titulo title="Dados do Administrador" />
        <button @click="isOpenDialog = true" v-tippy:right>
          <icon-edit />
        </button>
        <tippy target="right" placement="right">Editar Administrador</tippy
        >
      </div>

      <form class="my-3.5">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <label-input
            id="cnpj"
            label="CNPJ"
            type="text"
            class-wrapper="w-full md:w-[177px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="14.333.879/0001-18"
            :disabled="isDisabled"
          />

          <label-input
            id="razao_social"
            label="Razão Social"
            type="text"
            class-wrapper="w-full md:w-[420px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="Banco do Brasil S/A"
            :disabled="isDisabled"
          />

          <label-input
            id="nome_fantasia"
            label="Nome Fantasia"
            type="text"
            class-wrapper="w-full md:w-[240px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="Instituição Financeira"
            :disabled="isDisabled"
          />
        </div>
        <div class="flex flex-col md:flex-row gap-4 items-center mt-4">
          <label-input
            id="tipo_endereco"
            label="Tipo de Endereço"
            type="text"
            class-wrapper="w-full md:w-[177px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="Comercial"
            :disabled="isDisabled"
          />
          <label-input
            id="endereco"
            label="Endereço Completo"
            type="text"
            class-wrapper="w-full md:w-[620px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="Rua Engenheiro Almirante Tamandaré, nr 235, Centro"
            :disabled="isDisabled"
          />
          <label-input
            id="cidade"
            label="Cidade"
            type="text"
            class-wrapper="w-full md:w-[220px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="Almirante Tamandaré"
            :disabled="isDisabled"
          />
          <label-input
            id="uf"
            label="UF"
            type="text"
            class-wrapper="w-full md:w-[50px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="PR"
            :disabled="isDisabled"
          />
          <label-input
            id="cep"
            label="CEP"
            type="text"
            class-wrapper="w-full md:w-[100px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="78.900-000"
            :disabled="isDisabled"
          />
        </div>
      </form>
    </div>
	</main>
    <modal-layout
      title="Cadastro Administrador"
      :is-open="isOpenDialog"
      size="max-w-[834px]"
      @btn-close="isOpenDialog = false"
    >
      <cadastro-modal-administrador @btn-cancelar="isOpenDialog = false" />
    </modal-layout>
</template>
