<script lang="ts" setup>
	import Vue3Datatable from '@bhplugin/vue3-datatable'
	import { reactive, ref } from 'vue'

	// Componentes
	import titulo from '@components/layout/tituloLayout.vue'
	import modalLayout from '@components/layout/modalLayout.vue'

	// Icons
	import IconAdd from '@icons/iconAdd.vue'
	import IconEdit from '@icons/iconEdit.vue'
	import IconBlock from '@icons/iconBlock.vue'
	import IconCheck from '@icons/iconCheck.vue'

	// Declarações
	const isOpenDialog = ref<boolean>(false)
	const cols = reactive([
		{ field: 'averbadores', title: 'Averbadores', hide: false, sort: false, },
		{ field: 'gestor', title: 'Gestor', hide: false, sort: false, },
		{ field: 'telefone', title: 'Telefone', hide: false, sort: false, },
		{ field: 'celular', title: 'Celular', hide: false, sort: false, },
		{ field: 'email', title: 'E-mail', hide: false, sort: false, },
		{ field: 'status', title: 'Status', hide: false, sort: false, },
		{ field: 'actions', title: 'Ações', hide: false, sort: false, },
	])
	const rows = reactive([
		{
      id: '55622',
      averbadores: 'RH Administração Direta',
      gestor: 'João Carlos de Oliveira Carvalho',
      telefone: '(47) 3322-4455',
      celular: '(47) 9991-4455',
      email: 'financas@prefeitura.sc.gov.br',
      status: 'Ativo',
    },
    {
      id: '55632',
			averbadores: 'RH Secretaria Educação',
      gestor: 'Mário José da Silva Chavier',
      telefone: '(47) 3322-4455',
      celular: '(47) 9991-4455',
      email: 'gabinete@prefeitura.sc.gov.br',
      status: 'Inativo',
    },
	])

  // Scripts
  const color = (value: string) => {
		switch (value) {
			case 'Ativo':
				return 'bg-success'
			case 'Inativo':
				return 'bg-warning'
		}
	}
</script>

<template>
	<main>
		<div class="panel mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<div class="flex items-center gap-14">
					<titulo title="Lista de Averbadores" />
					<button v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right"
						>Cadastre um novo Contrato</tippy
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
					<template #status="data">
						<span
							class="flex justify-center badge !w-[80px] h-[22px]"
							:class="color(data.value.status)"
							>{{ data.value.status }}</span
						>
					</template>
					<template #actions="data">
						<div class="flex gap-2">
              <button><icon-edit /></button>
              <button v-if="data.value.status === 'Ativo'"><icon-block /></button>
              <button v-else><icon-check /></button>
            </div>
					</template>
				</vue3-datatable>
			</div>
		</div>

		<modal-layout
			:is-open="isOpenDialog"
			title="Extrato Mensal dos Descontos"
			size="max-w-full"
			btn-close
			@btn-close="isOpenDialog = false"
		>
			<!-- Datatable-->

			<!-- Datatable-->
		</modal-layout>
	</main>
</template>
