<script lang="ts" setup>
	import Vue3Datatable from '@bhplugin/vue3-datatable'
	import { reactive, ref } from 'vue'

	// Componentes
	import titulo from '@components/layout/tituloLayout.vue'
	import modalLayout from '@components/layout/modalLayout.vue'

	import CadastroModalGestor from '../cadastro-modal-gestor/cadastro-modal-gestor.vue'

	// Icons
	import IconAdd from '@icons/iconAdd.vue'
	import IconEdit from '@icons/iconEdit.vue'
	import IconDelete from '@icons/iconDelete.vue'

	// Declarações
	const isOpenDialog = ref<boolean>(false)
	const cols = reactive([
		{ field: 'id', title: '#', hide: true, sort: false, },
		{ field: 'gestor', title: 'Gestores', hide: false, sort: false, },
		{ field: 'cargo', title: 'Cargo', hide: false, sort: false, },
		{ field: 'telefone', title: 'Telefone', hide: false, sort: false, },
		{ field: 'celular', title: 'Celular', hide: false, sort: false, },
		{ field: 'email', title: 'E-mail', hide: false, sort: false, },
		{ field: 'actions', title: 'Ações', hide: false, sort: false, },
	])
	const rows = reactive([
		{
			id: 1,
      gestor: 'João Carlos de Oliveira Carvalho',
      cargo: 'Secretário de Administração e Finanças',
      telefone: '(47) 3322-4455',
      celular: '(47) 9991-4455',
      email: 'financas@prefeitura.sc.gov.br',
    },
    {
			id: 2,
      gestor: 'Mário José da Silva Chavier',
      cargo: 'Prefeito Municipal',
      telefone: '(47) 3322-4455',
      celular: '(47) 9991-4455',
      email: 'gabinete@prefeitura.sc.gov.br',
    },
	])

  // Scripts
</script>

<template>
	<main>
		<div class="panel mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex items-center gap-14">
					<titulo title="Lista de Gestores" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right"
						>Cadastre um novo gestor</tippy
					>
				</div>
			</div>

			<div class="datatable">
				<vue3-datatable
					:rows="rows"
					:columns="cols"
					:total-rows="rows.length"
					:sortable="true"
					skin="whitespace-nowrap bh-table-striped mb-5"
					no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas"
					:pagination="false"
				>
					<template #actions="data">
						<div class="flex gap-2">
              <button><icon-edit /></button>
              <button><icon-delete /></button>
            </div>
					</template>
				</vue3-datatable>
			</div>
		</div>

		<modal-layout
			:is-open="isOpenDialog"
			title="Cadastro Gestores do Consignante"
			size="max-w-[526px]"
			@btn-close="isOpenDialog = false"
		>
			<!-- Datatable-->
			<cadastro-modal-gestor @btn-cancelar="isOpenDialog = false" />
			<!-- Datatable-->
		</modal-layout>
	</main>
</template>
