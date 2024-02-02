<script lang="ts" setup>
	import flatPickr from 'vue-flatpickr-component'
	import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index.js'
	import Vue3Datatable from '@bhplugin/vue3-datatable'
	import { reactive, ref } from 'vue'

	import { Portuguese } from 'flatpickr/dist/l10n/pt.js'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'
	import modalLayout from '@components/layout/modalLayout.vue'

	import ConsultaMensalDesconto from './consultas-historico/consulta-mensal-desconto.vue'
	import ConsultasExport from './consultas-export/consultas-export.vue'
	import ConsultasTitulo from './consultas-titulo/consultas-titulo.vue'

	// Icons
	import IconClear from '@icons/iconClear.vue'
	import IconFile from '@icons/iconFile.vue'
	import IconPrinter from '@icons/iconPrinter.vue'

	// Declarações
	const isOpenDialog = ref<boolean>(false)
	const cols = reactive([
		{ field: 'mes', title: 'Mês', hide: false },
		{ field: 'valor_desconto', title: 'Valor desconto', hide: false },
		{ field: 'valor_enviado', title: 'Valor enviado', hide: false },
		{ field: 'valor_descontado', title: 'Valor descontado', hide: false },
		{ field: 'saldo_desconto', title: 'Saldo desconto', hide: false },
	])
	const rows = reactive([
		{
			mes: 'Jan/2024',
			valor_desconto: 0,
			valor_enviado: 100,
			valor_descontado: 0,
			saldo_desconto: 0.92,
		},
		{
			mes: 'Fev/2024',
			valor_desconto: 100,
			valor_enviado: 0,
			valor_descontado: 100,
			saldo_desconto: 50,
		},
		{
			mes: 'Mar/2023',
			valor_desconto: 0,
			valor_enviado: 100,
			valor_descontado: 100,
			saldo_desconto: 120,
		},
		{
			mes: 'Mar/2023',
			valor_desconto: 100,
			valor_enviado: 100,
			valor_descontado: 0,
			saldo_desconto: 0,
		},
		{
			mes: 'Abr/2022',
			valor_desconto: 100,
			valor_enviado: 0,
			valor_descontado: 100,
			saldo_desconto: 0,
		},
	])
	const columns = reactive({
		RMC: 'rmc',
		Data: 'data',
		'Tipo RMC': 'tipo_rmc',
		'Cód Autorização': 'cod_autorizacao',
		'Tipo Autorização': 'tipo_autorizacao',
		'Margem Reservada': 'margem_reservada',
		'Tipo Consignação': 'tipo_consignado',
		Consignatária: 'consignataria',
		'Local Atendimento': 'local_atendimento',
		Operador: 'operador',
		'Valor RMC': 'valor_rmc',
		Status: 'status.label',
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

	const clearFilter = () => {
		dateSelected.value = ''
	}
</script>

<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Histórico Anual dos Descontos']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<consultas-titulo title="Extrato Anual dos Descontos " />

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

			<div class="datatable mb-[344px]">
				<vue3-datatable
					:rows="filterDate()"
					:columns="cols"
					:total-rows="rows.length"
					:sortable="true"
					skin="whitespace-nowrap bh-table-striped mb-5"
					no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas"
				>
					<template #mes="data">
						<button @click="isOpenDialog = true">
							<strong class="text-primary_3-table">{{ data.value.mes }}</strong>
						</button>
					</template>
					<template #valor_desconto="data">
						<span :class="formatedCurrency(data.value.valor_desconto).color">{{
							formatedCurrency(data.value.valor_desconto).currency
						}}</span>
					</template>
					<template #valor_enviado="data">
						<span :class="formatedCurrency(data.value.valor_enviado).color">{{
							formatedCurrency(data.value.valor_enviado).currency
						}}</span>
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
			<consulta-mensal-desconto />
			<!-- Datatable-->
		</modal-layout>
	</main>
</template>
