<script lang="ts" setup>
	import { reactive } from 'vue'

	// Props
	const props = defineProps({
		id: {
			type: Number,
			required: true,
		},
	})

	// Componentes
	import ConsultasExport from '../consultas-export/consultas-export.vue'
	import ConsultasTitulo from '../consultas-titulo/consultas-titulo.vue'
	import ImageName from '../consultas-historico/datatable-coluna-image-name.vue'

	// Icons
	import IconPrinter from '@icons/iconPrinter.vue'

	// Declaraçoes
	const cols = reactive({
		local: 'Local',
		endereco: 'Endereço',
		telefone: 'Telefone',
		email: 'E-mail',
	})
	const rows = reactive([
		{
			local: 'Agência Centro',
			endereco: 'Rua Principal, nr 234, centro.',
			telefone: '(47) 3355-6655',
			email: 'ag1789@caixa.gov.br',
		},
		{
			local: 'Agência Centro',
			endereco: 'Rua Principal, nr 234, centro.',
			telefone: '(47) 3355-6655',
			email: 'ag1789@caixa.gov.br',
		},
	])
</script>
<template>
	<div class="panel pb-0 mt-6">
		<div
			class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
		>
			<consultas-titulo title="Pontos de Atendimentos" />

			<div
				class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto"
			>
				<div>
					<image-name
						image="https://placehold.co/30x30"
						name="Banco do Brasil"
						description="Instituição Financeira"
					/>
				</div>
				<div>
					<consultas-export
						v-tippy:top
						:cols="cols"
						:rows="rows"
						export-type="print"
					>
						<template #icon>
							<icon-printer class="w-5 h-5" />
						</template>
					</consultas-export>
					<tippy target="top" placement="top">Imprimir</tippy>
				</div>
			</div>
		</div>

		<div class="table-responsive">
			<table>
				<thead>
					<tr>
						<th>Local</th>
						<th>Endereço</th>
						<th>Telefone</th>
						<th>E-mail</th>
						<th>Ação</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in rows" :key="row.id">
						<td>{{ row.local }}</td>
						<td>{{ row.endereco }}</td>
						<td>{{ row.telefone }}</td>
						<td>{{ row.email }}</td>
						<td></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
