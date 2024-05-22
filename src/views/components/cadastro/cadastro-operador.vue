<script lang="ts" setup>
	import { reactive, ref } from 'vue'

	// Componentes
  import VueCollapsible from 'vue-height-collapsible/vue3'
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'
	import titulo from '@components/layout/tituloLayout.vue'
  import modalLayout from '@components/layout/modalLayout.vue'
  import LabelInput from '@components/layout/forms/inputs/inputLabel.vue'
  import LabelSelect from '@components/layout/forms/inputs/selectLabel.vue'
  import alertLayout from '@components/layout/alertLayout.vue'

  import ConsultasCadastroPessoa from '../consultas/consultas-cadastro-pessoa/consultas-cadastro-pessoa.vue'
  import CadastroPerfilOperador from './cadastro-perfil-operador/cadastro-perfil-operador.vue'

	// Icons
  import IconAdd from '@icons/iconAdd.vue'
  import IconCaretDown from '@icons/iconCaretDown.vue'

	// Declarações
  const isDisabled = ref(true)
  const isOpenDialog = ref(false)
  const accordians = reactive({
    perfilOperador: false,
  })

</script>
<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Operador']" />
		<div class="panel mt-6">
      <div class="flex items-center gap-14">
        <titulo title="Selecione a Pessoa" />
        <button @click="isOpenDialog = true" v-tippy:right>
          <icon-add />
        </button>
        <tippy target="right" placement="right"
          >Cadastre uma nova pessoa</tippy
        >
      </div>

      <div class="flex flex-col md:flex-row gap-5 mt-3">
        <label-input
          type="cpf"
          id="cpf"
          label="Digite o nº do CPF"
          class-label="text-sm"
          class-input="md:w-[300px]"
          layout="row"
        />
        <label-input
          id="nome"
          label="Nome"
          :disabled="isDisabled"
          class-label="text-sm"
          class-input="md:w-[400px]"
          layout="row"
        />
        <label-select
          id="perfil_operador"
          label="Selecione Perfil do Operador"
          class-label="text-sm"
          class-select="md:w-[200px]"
          layout="row"
          :options="['Analista', 'vendedor', 'Gerente', 'Aprovador']"
        />
        <div class="flex self-end gap-7 mb-1">
          <label class="inline-flex">
            <input type="radio" name="perfil" class="form-radio rounded-full" />
            <span class="text-sm ml-3">Back Office</span>
          </label>
          <label class="inline-flex">
            <input type="radio" name="perfil" class="form-radio rounded-full" />
            <span class="text-sm ml-3">Ponto de Venda</span>
          </label>
        </div>
      </div>
      <div class="flex flex-col md:flex-row gap-5 mt-5">
        <label-input
          id="local_operacao"
          label="Selecione Local da Operação"
          class-label="text-sm"
          class-input="md:w-[300px]"
          layout="row"
        />
        <label-input
          id="cidade"
          label="Cidade"
          :disabled="isDisabled"
          class-label="text-sm"
          class-input="md:w-[300px]"
          layout="row"
        />
        <label-input
          id="uf"
          label="UF"
          :disabled="isDisabled"
          class-label="text-sm"
          class-input="md:w-[70px]"
          layout="row"
        />
        <label-input
          id="ponto_venda"
          label="Tipo Ponto de Venda"
          :disabled="isDisabled"
          class-label="text-sm"
          class-input="md:w-[300px]"
          layout="row"
        />
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

    <div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#fff]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#fff]"
				@click="accordians.perfilOperador === true ? (accordians.perfilOperador = false) : (accordians.perfilOperador = true)"
			>
				Perfil de Operador Cadastrado
				<div
					:class="{ 'rotate-180': accordians.perfilOperador === true }"
				>
						<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.perfilOperador === true">
        <cadastro-perfil-operador />
			</vue-collapsible>
		</div>

    <alert-layout />

    <modal-layout
			:is-open="isOpenDialog"
			size="max-w-full"
			@btn-close="isOpenDialog = false"
		>
			<consultas-cadastro-pessoa
        :disabled="false"
        @btn-cancelar="isOpenDialog = false"
      />
		</modal-layout>
	</main>
</template>
