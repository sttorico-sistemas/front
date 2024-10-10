<script lang="ts" setup>
import Vue3Datatable from '@bhplugin/vue3-datatable'
import { reactive } from 'vue'
import titulo from 'src/core/components/Titulo.vue'
import { Col } from 'types/col';

const cols = reactive<Col[]>([
	{ field: 'id', title: '#', hide: true, sort: false, },
	{ field: 'data_hora', title: 'Data/Hora', hide: false, sort: false, },
	{ field: 'tipo_acao', title: 'Tipo  de Ação', hide: false, sort: false, },
	{ field: 'componente', title: 'Componente', hide: false, sort: false, },
	{ field: 'operador', title: 'Operador', hide: false, sort: false, },
	{ field: 'nome', title: 'Nome', hide: false, sort: false, },
	{ field: 'endereco_ip', title: 'Endereço IP', hide: false, sort: false, },
])
const rows = reactive([
	{
		id: 1,
		data_hora: '02/02/2024 - 11:27',
		tipo_acao: 'Cadastro',
		componente: 'Gestores',
		operador: 'marcio.admin',
		nome: 'Marcio Borges',
		endereco_ip: '123.131.33.2',
	},
])
</script>

<template>
	<main>
		<div class="panel">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<titulo title="Logs de Alterações" />
			</div>

			<div class="datatable">
				<vue3-datatable :rows="rows" :columns="cols" :total-rows="rows.length" :sortable="true"
					skin="whitespace-nowrap bh-table-striped mb-5" no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas" :pagination="false" />
			</div>
		</div>
	</main>
</template>
