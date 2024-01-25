<script lang="ts" setup>
	import { reactive } from 'vue'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'

	import ConsultasDatatable from './consultas-datatable/consultas-datatable.vue'
	import ConsultasExport from './consultas-export/consultas-export.vue'
	import ConsultasTitulo from './consultas-titulo/consultas-titulo.vue'

	// Icons
	import IconFile from '@icons/iconFile.vue'
	import IconPrinter from '@icons/iconPrinter.vue'

	// Declarações
	const selected = reactive<{ type: string; label: string }>({
		type: '',
		label: '',
	})

	const cols = reactive([
		{ field: 'mes', title: 'Mês', hide: false },
		{ field: 'valor_desconto', title: 'Valor desconto', hide: false },
		{ field: 'valor_enviado', title: 'Valor enviado', hide: false },
		{ field: 'valor_descontado', title: 'Valor descontado', hide: false },
		{ field: 'saldo_desconto', title: 'Saldo desconto', hide: false },
	])
	const rows = reactive([
		{
			mes: 'dez/23',
			valor_desconto: 'R$ 100,00',
			valor_enviado: 'R$ 100,00',
			valor_descontado: 'R$ 100,00',
			saldo_desconto: 'R$ 0,00',
		},
		{
			mes: 'nov/23',
			valor_desconto: 'R$ 100,00',
			valor_enviado: 'R$ 100,00',
			valor_descontado: 'R$ 100,00',
			saldo_desconto: 'R$ 0,00',
		},
		{
			mes: 'out/23',
			valor_desconto: 'R$ 100,00',
			valor_enviado: 'R$ 100,00',
			valor_descontado: 'R$ 100,00',
			saldo_desconto: 'R$ 0,00',
		},
		{
			mes: 'set/23',
			valor_desconto: 'R$ 100,00',
			valor_enviado: 'R$ 100,00',
			valor_descontado: 'R$ 100,00',
			saldo_desconto: 'R$ 0,00',
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

			<consultas-datatable :selected="selected" :cols="cols" :rows="rows" />
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
	}
</style>
