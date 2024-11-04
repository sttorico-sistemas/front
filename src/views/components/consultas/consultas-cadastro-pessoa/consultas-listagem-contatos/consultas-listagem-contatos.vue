<script lang="ts" setup>
	import { reactive, ref } from 'vue'
	import Vue3Datatable from '@bhplugin/vue3-datatable'

	// Componentes
	import titulo from '@components/layout/tituloLayout.vue'
  import ConsultasCadastroPessoaContato from '../consultas-cadastro-pessoa-contato/consultas-cadastro-pessoa-contato.vue'
	import modalLayout from '@components/layout/modalLayout.vue'

	// Icons
	import IconEdit from '@icons/iconEdit.vue'
	import IconDelete from '@icons/iconDelete.vue'
	import IconAdd from '@icons/iconAdd.vue'

	// Declarações
	const isOpenDialog = ref(false)
	const cols = reactive([
		{ field: 'tp_contato', title: 'Tipo Contato', hide: false },
		{ field: 'telefone', title: 'Telefone', hide: false },
		{ field: 'celular', title: 'Celular', hide: false },
		{ field: 'email', title: 'E-mail', hide: false },
		{ field: 'actions', title: 'Ação', hide: false, sort: false },
	])
	const rows = reactive([
		{
      id: 1,
			tp_contato: 'Pessoal',
      telefone: '(47) 3355-4011',
      celular: '(47) 9955-4011',
      email: 'souza.martins@hotmail.com.br',
		},
    {
      id: 2,
			tp_contato: 'Comercial',
      telefone: '(47) 3355-4011',
      celular: '(47) 9955-4011',
      email: 'souza.martins@hotmail.com.br',
		},
	])

	// Script
</script>
<template>
	<main>
		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex items-center gap-14">
					<titulo title="Contatos" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right">Adicionar novo contato</tippy>
				</div>
			</div>

			<div class="datatable pb-5">
				<vue3-datatable
					:rows="rows"
					:columns="cols"
					:total-rows="rows.length"
					:sortable="true"
					skin="whitespace-nowrap bh-table-striped"
					no-data-content="Nenhum dado foi encontrado"
					:pagination="false"
					class="mt-4"
				>
					<template #actions="data">
						<div class="flex gap-2">
							<div>
								<button
									v-tippy:right
									type="button"
									class="text-xs m-1"
									@click="isOpenDialog = true"
								>
									<icon-edit class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right"
									>Editar</tippy
								>
							</div>
							<div>
								<button
									v-tippy:right
									type="button"
									class="text-xs m-1"
								>
									<icon-delete class="w-5 h-5 text-primary_3-table" />
								</button>
								<tippy target="right" placement="right"
									>Deletar</tippy
								>
							</div>
						</div>
					</template>
				</vue3-datatable>
			</div>
		</div>
		<modal-layout
      title="Adicionar Contato"
      :is-open="isOpenDialog"
      size="max-w-[600px]"
      @btn-close="isOpenDialog = false"
    >
      <consultas-cadastro-pessoa-contato @btn-cancelar="isOpenDialog = false" />
    </modal-layout>
	</main>
</template>
