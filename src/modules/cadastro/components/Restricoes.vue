<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { reactive, ref } from 'vue'
import titulo from 'src/core/components/Titulo.vue'
import modalLayout from 'src/core/components/Modal.vue'
import CadastrarRegulamento from './Modal/CadastrarRegulamento.vue'
import IconAdd from 'src/core/components/Icons/IconAdd.vue'

const isOpenDialog = ref(false);

const cols = reactive([
	{ field: 'id', title: '#', hide: true, sort: false, },
	{ field: 'servicos', title: 'Serviços', hide: false, sort: false, },
	{ field: 'regra', title: 'Regra', hide: false, sort: false, },
	{ field: 'delimitador', title: 'Delimitador', hide: false, sort: false, },
	{ field: 'vlr_delimitado', title: 'Vlr Delimitado', hide: false, sort: false, },
	{ field: 'unid_delimitado', title: 'Unid. Delimitada', hide: false, sort: false, },
	{ field: 'dt_inicio', title: 'Dt Início', hide: false, sort: false, },
	{ field: 'dt_final', title: 'Dt Final', hide: false, sort: false, },
	{ field: 'status', title: 'Status', hide: false, sort: false, },
])
const rows = reactive([
	{
		id: 1,
		servicos: 'Empréstimos',
		regra: 'Prazo Máximo Descto',
		delimitador: 'Meses',
		vlr_delimitado: 'Menor que, incluso',
		unid_delimitado: 96,
		dt_inicio: '20/10/2015',
		dt_final: '20/12/2020',
		status: 'Ativo',
	},
])

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
		<div class="panel">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="flex items-center gap-14">
					<titulo title="Exceções as Regras" />
					<button @click="isOpenDialog = true" v-tippy:right>
						<icon-add />
					</button>
					<tippy target="right" placement="right">Cadastre um novo Exceções as Regras</tippy>
				</div>
			</div>

			<div class="datatable">
				<vue3-datatable :rows="rows" :columns="cols" :total-rows="rows.length" :sortable="true"
					skin="whitespace-nowrap bh-table-striped mb-5" no-data-content="Nenhum dado foi encontrado"
					pagination-primary="Mostrando {0} a {1} de {2} entradas">
					<template #dcto="data">
						<icon-doc />
					</template>
					<template #status="data">
						<span class="flex justify-center badge !w-[80px] h-[22px]" :class="color(data.value.status)">{{
							data.value.status }}</span>
					</template>
				</vue3-datatable>
			</div>
		</div>
		<modal-layout title="Cadastro Exceção as Regras" :is-open="isOpenDialog" size="max-w-[600px]"
			@btn-close="isOpenDialog = false">
			<cadastrar-regulamento title="Exceção as Regras" @btn-cancelar="isOpenDialog = false" />
		</modal-layout>
	</main>
</template>
