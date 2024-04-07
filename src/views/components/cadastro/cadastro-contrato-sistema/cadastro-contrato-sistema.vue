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
		{ field: 'cod', title: 'Cód. Contrato', hide: false, sort: false, },
		{ field: 'tipo_contrato', title: 'Tipo Contrato', hide: false, sort: false, },
		{ field: 'vigencia', title: 'Vigência', hide: false, sort: false, },
		{ field: 'data_inicial', title: 'Data Inicial', hide: false, sort: false, },
		{ field: 'data_final', title: 'Data Final', hide: false, sort: false, },
		{ field: 'status', title: 'Status', hide: false, sort: false, },
		{ field: 'actions', title: 'Ações', hide: false, sort: false, },
	])
	const rows = reactive([
		{
      cod: '55622',
      tipo_contrato: 'Contrato Comodato',
      vigencia: '48',
      data_inicial: '23/03/2018',
      data_final: '23/03/2023',
      status: 'Ativo',
    },
    {
      cod: '55632',
      tipo_contrato: 'Acordo de Cooperação Técnica',
      vigencia: '60',
      data_inicial: '23/03/2018',
      data_final: '23/03/2023',
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
					<titulo title="Contratos Sistema" />
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
