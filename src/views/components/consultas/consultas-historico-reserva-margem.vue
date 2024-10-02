<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'

// Componentes
import breadcrumbs from '@/core/components/layout/breadcrumbsLayout.vue'
import titulo from '@/core/components/layout/tituloLayout.vue'

// Declarações
const selected = reactive<{ type: string; label: string }>({
	type: '',
	label: '',
})
const margem = ref<string>('')
const ano = ref<string>('2023')
const headerChart = reactive({
	percent: '',
	title: '',
	valor: '',
})
const anos = reactive([2018, 2019, 2020, 2021, 2022, 2023, 2024])
const series = ref<any>([])
const chartOptions = reactive({
	chart: {
		height: 350,
		type: 'area',
		toolbar: {
			show: false,
		},
	},
	colors: ['#E7515A', '#2196F3'],
	dataLabels: {
		enabled: false,
	},
	stroke: {
		curve: 'smooth',
		width: 2,
	},
	xaxis: {
		categories: [
			'Jan',
			'Fev',
			'Mar',
			'Abr',
			'Mai',
			'Jun',
			'Jul',
			'Ago',
			'Set',
			'Out',
			'Nov',
			'Dez',
		],
	},
	grid: {
		borderColor: '#e0e6ed',
		strokeDashArray: 5,
		xaxis: {
			lines: {
				show: true,
			},
		},
		yaxis: {
			lines: {
				show: false,
			},
		},
		padding: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		},
	},
	legend: {
		position: 'top',
		horizontalAlign: 'right',
		fontSize: '14px',
		markers: {
			width: 10,
			height: 10,
			offsetX: -2,
		},
		itemMargin: {
			horizontal: 10,
			vertical: 5,
		},
	},
	tooltip: {
		x: {
			format: 'dd/MM/yy',
		},
	},
	fill: {
		type: 'gradient',
		gradient: {
			shadeIntensity: 1,
			inverseColors: !1,
			opacityFrom: 0.28,
			opacityTo: 0.05,
			stops: [45, 100],
		},
	},
})

// Scripts
const fetchReservaMargem = () => {
	const data = [
		{
			name: 'Valor Margem',
			data: [
				1200, 4000, 2800, 5100, 4200, 1090, 1000, 9000, 1000, 5600, 7600,
				4300,
			],
		},
		{
			name: 'Valor Margem Reservada',
			data: [
				1100, 3200, 4500, 3200, 3400, 5200, 4100, 5100, 4200, 10900, 10000,
				9000,
			],
		},
		{
			margem: {
				porcentagem: '35%',
				titulo: 'Margem Principal',
				valorMargem: 'R$ 350,00',
			},
		},
	]

	series.value = data.filter((item: any) => item.name)

	data.filter((item: any) => {
		if (Object.prototype.hasOwnProperty.call(item, 'margem')) {
			headerChart.title = item.margem.titulo
			headerChart.percent = item.margem.porcentagem
			headerChart.valor = item.margem.valorMargem
		}
	})
}

// LifeCycles
onMounted(() => {
	fetchReservaMargem()
})
</script>
<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Histórico da Reserva da Margem']" />

		<div class="panel mt-6">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<titulo title="Histórico da Reserva da Margem" />

				<div class="header_actions w-80 flex justify-end items-center gap-5">
					<multiselect v-model="margem" :options="[
						{
							name: 'margem35',
							label: 'Margem 35%',
						},
						{
							name: 'margem10',
							label: 'Margem 10%',
						},
						{
							name: 'margem5',
							label: 'Margem 5%',
						},
					]" track-by="name" label="label" class="custom-multiselect max-w-[230px]" placeholder="Selecione o tipo de Margem"
						:searchable="false" :preselect-first="false" :allow-empty="false" selected-label="" select-label=""
						deselect-label="" @select="(selected.label = $event), (selected.type = 'margem')" />
					<multiselect v-model="ano" :options="anos" class="custom-multiselect max-w-[200px]"
						placeholder="Selecione o Ano" :searchable="false" :preselect-first="false" :allow-empty="false"
						selected-label="" select-label="" deselect-label=""
						@select="(selected.label = $event), (selected.type = 'ano')" />
				</div>
			</div>
			<div id="grafico" class="panel h-full">
				<div>
					<div class="w-full flex justify-between items-center">
						<div>
							<h3 class="text-primary_3 text-xl font-semibold mb-5">
								<span class="text-secondary text-xl font-bold">{{
									headerChart.percent
								}}</span>
								{{ headerChart.title }}
							</h3>
							<p class="text-sm">
								Valor atual da Margem
								<span class="text-secondary text-sm font-bold">{{
									headerChart.valor
								}}</span>
							</p>
						</div>
						<div>
							<strong class="text-[#2196F3] text-4xl font-bold">{{
								ano
							}}</strong>
						</div>
					</div>
					<apexchart type="area" height="484" :options="chartOptions" :series="series" />
				</div>
			</div>
		</div>
	</main>
</template>
<style lang="scss" scoped>
.header_actions:deep(.custom-multiselect) {
	.multiselect__placeholder {
		font-size: 0.75rem;
		line-height: 1rem;
		font-weight: 600;
		white-space: nowrap;
		color: rgb(14 23 38);
	}

	.multiselect__option {
		font-size: 0.75rem;
		line-height: 1rem;
		white-space: normal;
	}
}
</style>
