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
			id: 1,
			local: 'Agência Centro',
			endereco: 'Rua Principal, nr 234, centro.',
			telefone: '(47) 3355-6655',
			email: 'ag1789@caixa.gov.br',
		},
		{
			id: 2,
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
			<div
				class="w-full flex justify-between items-center gap-5 ltr:ml-auto rtl:mr-auto"
			>
				<div>
					<image-name
						image="https://placehold.co/30x30"
						name="Banco do Brasil"
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
						<th class="text-primary_3-table text-left text-sm font-semibold">
							Local
						</th>
						<th class="text-primary_3-table text-left text-sm font-semibold">
							Endereço
						</th>
						<th class="text-primary_3-table text-left text-sm font-semibold">
							Telefone
						</th>
						<th class="text-primary_3-table text-left text-sm font-semibold">
							E-mail
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in rows" :key="row.id">
						<td class="text-xs">{{ row.local }}</td>
						<td class="text-xs">{{ row.endereco }}</td>
						<td class="text-xs">{{ row.telefone }}</td>
						<td class="text-xs">{{ row.email }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
