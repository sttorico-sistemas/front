<script lang="ts" setup>
	import flatPickr from 'vue-flatpickr-component'
	import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index.js'
	import Vue3Datatable from '@bhplugin/vue3-datatable'
	import { reactive, ref } from 'vue'

	import 'flatpickr/dist/flatpickr.css'
	import 'flatpickr/dist/plugins/monthSelect/style.css'

	import { Portuguese } from 'flatpickr/dist/l10n/pt.js'

	import ConsultasExport from '../consultas-export/consultas-export.vue'
	import ConsultasTitulo from '../consultas-titulo/consultas-titulo.vue'
	import ImageName from './datatable-coluna-image-name.vue'

	// Icons
	import IconClear from '@icons/iconClear.vue'
	import IconFile from '@icons/iconFile.vue'
	import IconPrinter from '@icons/iconPrinter.vue'

	// Declarações
	const cols = reactive([
		{ field: 'consignataria', title: 'Consignatária', hide: false },
		{ field: 'tipo_servico', title: 'Tipo de Serviço', hide: false },
		{ field: 'n_contrato', title: 'Nº Contrato', hide: false },
		{ field: 'prazo', title: 'Prazo', hide: false },
		{ field: 'parcela', title: 'Parcela', hide: false },
		{ field: 'valor_descontar', title: 'Valor à Descontar', hide: false },
		{ field: 'valor_enviado', title: 'Valor Enviado', hide: false },
		{ field: 'valor_descontado', title: 'Valor Descontado', hide: false },
		{ field: 'saldo_desconto', title: 'Saldo desconto', hide: false },
		{ field: 'situacao', title: 'Situação', hide: false },
		{ field: 'observacao', title: 'Observações', hide: false },
	])
	const rows = reactive([
		{
			consignataria: {
				nome: 'Banco do Brasil',
				icone: '',
			},
			tipo_servico: {
				nome: '',
				icone: '',
			},
			n_contrato: 5615517431,
			prazo: 120,
			parcela: 12,
			valor_descontar: 100,
			valor_enviado: 100,
			valor_descontado: 100,
			saldo_desconto: 0,
			situacao: 'Descontado',
			observacao: '',
		},
		{
			consignataria: {
				nome: 'Banco do Brasil',
				icone: '',
			},
			tipo_servico: {
				nome: '',
				icone: '',
			},
			n_contrato: 5615517431,
			prazo: 120,
			parcela: 12,
			valor_descontar: 100,
			valor_enviado: 100,
			valor_descontado: 100,
			saldo_desconto: 0,
			situacao: 'Descontado',
			observacao: '',
		},
		{
			consignataria: {
				nome: 'ASM',
				icone: '',
			},
			tipo_servico: {
				nome: '',
				icone: '',
			},
			n_contrato: 32156484,
			prazo: 120,
			parcela: 6,
			valor_descontar: 300,
			valor_enviado: 300,
			valor_descontado: 0,
			saldo_desconto: 200,
			situacao: 'Negado',
			observacao: 'Insuficiência de Margem',
		},
		{
			consignataria: {
				nome: 'Capemisa',
				icone: '',
			},
			tipo_servico: {
				nome: '',
				icone: '',
			},
			n_contrato: 800025698,
			prazo: 'Indeterminado',
			parcela: 1,
			valor_descontar: 200,
			valor_enviado: 200,
			valor_descontado: 50,
			saldo_desconto: 150,
			situacao: 'Parcial',
			observacao: 'Excedente de Margem',
		},
	])
	const columns = reactive({
		Consignatária: 'consignataria',
		'Tipo de Serviço': 'tipo_servico',
		'Nº Contrato': 'n_contrato',
		Prazo: 'prazo',
		Parcela: 'parcela',
		'Valor à Descontar': 'valor_descontar',
		'Valor Enviado': 'valor_enviado',
		'Valor Descontado': 'valor_descontado',
		'Saldo Desconto': 'saldo_desconto',
		Situação: 'situacao',
		Observações: 'observacao',
	})

	const dateSelected = ref<string>('')
	const flatPickrConfig = reactive({
		locale: Portuguese,
		plugins: [
			monthSelectPlugin({
				shorthand: true,
				dateFormat: 'M/Y',
			}),
		],
	})

	const filterDate = () => {
		if (dateSelected.value === '' || dateSelected.value === null) return rows

		return rows.filter(
			(mounthYear: any) => mounthYear.mes === dateSelected.value,
		)
	}

	const formatedCurrency = (value: number) => {
		if (value <= 0) {
			return {
				color: 'text-danger',
				currency: value.toLocaleString('pt-br', {
					style: 'currency',
					currency: 'BRL',
				}),
			}
		}

		return {
			color: '',
			currency: value.toLocaleString('pt-br', {
				style: 'currency',
				currency: 'BRL',
			}),
		}
	}

	const situacaoColor = (value: string) => {
		switch (value) {
			case 'Descontado':
				return 'bg-primary'
			case 'Negado':
				return 'bg-danger'
			case 'Parcial':
				return 'bg-secondary'
		}
	}

	const clearFilter = () => {
		dateSelected.value = ''
	}
</script>

<template>
	<main>
		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<consultas-titulo title="Extrato Mensal dos Descontos " />

				<div
					class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto"
				>
					<flat-pickr
						v-model="dateSelected"
						class="form-input form-select"
						:config="flatPickrConfig"
						@change="filterDate"
					/>

					<div>
						<button
							v-tippy:top
							type="button"
							class="text-xs m-1"
							@click="clearFilter()"
						>
							<icon-clear class="w-5 h-5 text-primary_3-table" />
						</button>
						<tippy target="top" placement="top">Limpar pesquisa</tippy>
					</div>

					<div>
						<download-excel
							v-tippy:top
							:fields="columns"
							:data="rows"
							name="resumo-da-rmc_reserva_da_margem-de-consignacao.xls"
							class="text-xs cursor-pointer"
						>
							<icon-file class="w-5 h-5" />
						</download-excel>
						<tippy target="top" placement="top">Exportar XLS</tippy>
					</div>

					<div class="w-5 h-5">
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

			<div class="datatable">
				<vue3-datatable
					:rows="filterDate()"
					:columns="cols"
					:total-rows="rows.length"
					:sortable="true"
					skin="whitespace-nowrap bh-table-striped mb-5"
					no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas"
				>
					<template #consignataria="data">
						<image-name
							image="https://placehold.co/30x30"
							:name="data.value.consignataria.nome"
						/>
					</template>
					<template #tipo_servico="data">
						<image-name
							image="https://placehold.co/30x30"
							:name="data.value.tipo_servico.nome"
						/>
					</template>
					<template #n_contrato="data">
						<strong class="text-primary_3-table">{{
							data.value.n_contrato
						}}</strong>
					</template>
					<template #valor_descontado="data">
						<span
							:class="formatedCurrency(data.value.valor_descontado).color"
							>{{
								formatedCurrency(data.value.valor_descontado).currency
							}}</span
						>
					</template>
					<template #saldo_desconto="data">
						<span :class="formatedCurrency(data.value.saldo_desconto).color">{{
							formatedCurrency(data.value.saldo_desconto).currency
						}}</span>
					</template>
					<template #situacao="data">
						<span
							class="badge block text-center"
							:class="situacaoColor(data.value.situacao)"
							>{{ data.value.situacao }}</span
						>
					</template>
				</vue3-datatable>
			</div>
		</div>
	</main>
</template>
