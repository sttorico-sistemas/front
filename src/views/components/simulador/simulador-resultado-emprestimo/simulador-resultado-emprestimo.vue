<script lang="ts" setup>
import { reactive, ref } from 'vue'

// Componentes
import Vue3Datatable from '@bhplugin/vue3-datatable'
import titulo from '@/core/components/layout/tituloLayout.vue'

import ImageName from '../../consultas/consultas-historico/datatable-coluna-image-name.vue'

// Icons
import IconNote from '@/core/components/icons/iconNote.vue'

// Declarações
const selected = reactive<{ type: string; label: string }>({
	type: '',
	label: '',
})
const prazo = ref<string>('')
const cols = reactive([
	{ field: 'id', title: '#', hide: false },
	{ field: 'consignataria', title: 'Consignatária', sort: false, hide: false },
	{ field: 'prazo_meses', title: 'Prazo', hide: false },
	{ field: 'tax_juros', title: 'Tx de Juros (%am)', hide: false },
	{ field: 'cet_mensal', title: 'CET Mensal (%am)', hide: false },
	{ field: 'cet_anual', title: 'CET Anual (%aa)', hide: false },
	{ field: 'valor_parcela', title: 'Vlr Parcela', hide: false },
	{ field: 'valor_financiado', title: 'Vlr Financiado', hide: false },
	{ field: 'valor_liberado', title: 'Vlr Liberado', hide: false },
	{ field: 'solicitar_proposta', title: 'Solicitar Proposta', hide: false },
])
const rows = reactive([
	{
		id: 1,
		consignataria: {
			nome: 'Banco do Brasil',
			tipo: 'Instituição Financeira',
			icone: '',
		},
		prazo_meses: '120',
		tax_juros: '2,41',
		cet_mensal: '22,41',
		cet_anual: '28,00',
		valor_parcela: '280,20',
		valor_financiado: '28.000,20',
		valor_liberado: '26.000,20',
	},
	{
		id: 2,
		consignataria: {
			nome: 'Santander Brasil',
			tipo: 'Instituição Financeira',
			icone: '',
		},
		prazo_meses: '320',
		tax_juros: '4,41',
		cet_mensal: '44,41',
		cet_anual: '38,00',
		valor_parcela: '580,20',
		valor_financiado: '58.000,20',
		valor_liberado: '46.000,20',
	},
])

// Script
const clearFilter = () => {
	prazo.value = ''

	selected.label = ''
	selected.type = ''
}

const filtered = (value: string = '') => {
	if (value === '') return rows

	if (selected.type === 'prazo')
		return rows.filter((item: any) => item.prazo_meses === value)
}

const emits = defineEmits(['btnSave', 'btnClose'])
</script>
<template>
	<main>
		<div class="panel mt-6">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<titulo title="Resultado da Simulação de Empréstimos Financeiros " />

			</div>

			<div class="datatable">
				<vue3-datatable :rows="filtered(selected.label)" :columns="cols" :total-rows="filtered(selected.label)?.length"
					:sortable="false" skin="whitespace-nowrap bh-table-striped" no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas" :pagination="false">
					<template #id="data"> {{ data.value.id }}º </template>
					<template #consignataria="data">
						<image-name image="https://placehold.co/30x30" :name="data.value.consignataria.nome" />
					</template>
					<template #solicitar_proposta="data">
						<button v-tippy:right type="button" class="text-xs m-1">
							<icon-note class="w-5 h-5 text-primary_3-table" />
						</button>
						<tippy target="right" placement="right">Algum texto aqui {{ data.value.id }}</tippy>
					</template>
				</vue3-datatable>
				<div class="flex flex-col items-center justify-center flex-wrap mt-8 gap-8">
					<button type="button" class="btn border-primary_3-table text-primary_3-table shadow-none"
						@click="emits('btnClose', false)">Novo Cálculo</button>

					<p class="max-w-3xl text-danger text-sm font-medium text-center">
						A simulação serve somente para você ter noção de como ficará o valor final e o valor de cada parcela a ser
						paga,
						<strong>não possui as taxas de juros atualizadas diariamente, o que significa que os dados podem sofrer
							alterações.</strong>
					</p>
				</div>
			</div>
		</div>
	</main>
</template>
