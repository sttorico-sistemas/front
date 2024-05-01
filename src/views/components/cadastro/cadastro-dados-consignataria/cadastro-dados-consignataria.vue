<script lang="ts" setup>
  // Core
  import { reactive, ref } from 'vue'

	// Componentes
  import LabelInput from '@components/layout/forms/inputs/inputLabel.vue'
  import modalLayout from '@components/layout/modalLayout.vue'
	import titulo from '@components/layout/tituloLayout.vue'

  import CadastroModalConsignante from '../cadastro-modal-consignante/cadastro-modal-consignante.vue'

	// Icons
  import IconEdit from '@icons/iconEdit.vue'

  import IconCartaoCreditoServico from '@icons/services/iconCartaoCreditoServico.vue'
	import IconEmprestimoServico from '@icons/services/iconEmprestimosServicos.vue'
	import IconMensalidadeServico from '@icons/services/iconMensalidadeServicos.vue'
	import IconPlanoSaudeServico from '@icons/services/iconPlanoSaudeServico.vue'
	import IconSegurosServico from '@icons/services/iconSegurosServico.vue'

	// Declarações
  const isOpenDialog = ref<boolean>(false)

	// Script

</script>
<template>
	<main>
    <div class="panel mt-6">
      <div class="flex items-center gap-14">
        <titulo title="Dados do Consignatária " />
        <button class="hidden" @click="isOpenDialog = true" v-tippy:right>
          <icon-edit />
        </button>
        <tippy target="right" placement="right">Editar Consignatária</tippy
        >
      </div>

      <form class="my-3.5">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <label-input
            id="cod"
            label="Cód. Consignatária"
            type="text"
            class-wrapper="w-full md:w-[110px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="99.663"
            disabled
          />

          <label-input
            id="cnpj"
            label="CNPJ"
            type="text"
            class-wrapper="w-full md:w-[177px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="14.333.879/0001-18"
            disabled
          />

          <label-input
            id="consignataria"
            label="Consignatária"
            type="text"
            class-wrapper="w-full md:w-[420px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="Banco do Brasil S/A"
            disabled
          />

          <label-input
            id="tipo_instituicao"
            label="Tipo de Instituição"
            type="text"
            class-wrapper="w-full md:w-[240px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="Instituição Financeira"
            disabled
          />

          <label-input
            id="nome_curto"
            label="Nome Curto"
            type="text"
            class-wrapper="w-full md:w-[245px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="Banco do Brasil"
            disabled
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
            disabled
          />
          <label-input
            id="endereco"
            label="Endereço Completo"
            type="text"
            class-wrapper="w-full md:w-[620px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="Rua Engenheiro Almirante Tamandaré, nr 235, Centro"
            disabled
          />
          <label-input
            id="cidade"
            label="Cidade"
            type="text"
            class-wrapper="w-full md:w-[220px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="Almirante Tamandaré"
            disabled
          />
          <label-input
            id="uf"
            label="UF"
            type="text"
            class-wrapper="w-full md:w-[50px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="PR"
            disabled
          />
          <label-input
            id="cep"
            label="CEP"
            type="text"
            class-wrapper="w-full md:w-[100px]"
            class-label="text-[10px]"
            class-input="text-xs font-normal"
            value="78.900-000"
            disabled
          />
        </div>
      </form>

      <div class="flex items-center mt-5">
        <label class="text-xs my-0 mr-2">Tipo de Serviços:</label>
        <div class="flex items-center gap-1">
          <icon-cartao-credito-servico />
          <icon-emprestimo-servico />
          <icon-mensalidade-servico />
          <icon-seguros-servico />
        </div>
      </div>
    </div>
	</main>
    <modal-layout
      title="Cadastro Consignante"
      :is-open="isOpenDialog"
      size="max-w-[834px]"
      @btn-close="isOpenDialog = false"
    >
      <cadastro-modal-consignante @btn-cancelar="isOpenDialog = false" />
    </modal-layout>
</template>
