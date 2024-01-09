<script lang="ts" setup>
	import { computed, reactive, ref } from 'vue'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'

	import ConsultasDatatable from '../components/consultas/consultas-datatable/consultas-datatable.vue'
	import ConsultasExport from '../components/consultas/consultas-export/consultas-export.vue'
	import ConsultasPopper from '../components/consultas/consultas-popper/consultas-popper.vue'
	import ConsultasTitulo from '../components/consultas/consultas-titulo/consultas-titulo.vue'

	// Icons
	import IconClear from '@icons/iconClear.vue'
	import IconFile from '@icons/iconFile.vue'
	import IconPrinter from '@icons/iconPrinter.vue'

	// Declarações
	const selected = reactive<{ type: string; label: string }>({
		type: '',
		label: '',
	})
	const consignacao = ref<string>('')
	const consignataria = ref<string>('')
	const status = ref<string>('')
	const cols = reactive([
		{ field: 'rmc', title: 'RMC', isUnique: true, hide: false },
		{ field: 'data', title: 'Data', hide: false },
		{ field: 'tipo_rmc', title: 'Tipo RMC', hide: false },
		{ field: 'cod_autorizacao', title: 'Cód Autorização', hide: false },
		{ field: 'tipo_autorizacao', title: 'Tipo Autorização', hide: false },
		{ field: 'margem_reservada', title: 'Margem Reservada', hide: false },
		{ field: 'tipo_consignado', title: 'Tipo Consignação', hide: false },
		{ field: 'consignataria', title: 'Consignatária', hide: false },
		{ field: 'local_atendimento', title: 'Local Atendimento', hide: false },
		{ field: 'operador', title: 'Operador', hide: false },
		{ field: 'valor_rmc', title: 'Valor RMC', hide: false },
		{ field: 'status', title: 'Status', hide: false },
	])
	const rows = reactive([
		{
			rmc: 3629999,
			data: '09/19/2016 - 10:00',
			tipo_rmc: 'Originada',
			cod_autorizacao: '202356481BBQ',
			tipo_autorizacao: 'Manual',
			margem_reservada: 'Margem Principal - 35%',
			tipo_consignado: 'Financeiro',
			consignataria: 'Banco do Brasil S/A',
			local_atendimento: 'Agência Balneário Camboriú - 1489',
			operador: 'José da Silva',
			valor_rmc: 'R$ 100,00',
			status: {
				id: 1,
				label: 'Reservada',
			},
		},
		{
			rmc: 1203,
			data: 'informada',
			tipo_rmc: 'Importada',
			cod_autorizacao: 'Não informado',
			tipo_autorizacao: 'Não informado',
			margem_reservada: 'Margem Secundária - 5%',
			tipo_consignado: 'Bancario',
			consignataria: 'Banco Bradesco',
			local_atendimento: 'Agência Balneário Camboriú - 1489',
			operador: 'José da Silva',
			valor_rmc: 'R$ 100,00',
			status: {
				id: 2,
				label: 'Suspensa',
			},
		},
		{
			rmc: 7079,
			data: '07/18/2017 - 14:00',
			tipo_rmc: 'Originada',
			cod_autorizacao: '202200128CHS',
			tipo_autorizacao: 'On-line',
			margem_reservada: 'Margem Principal - 5%',
			tipo_consignado: 'Logista',
			consignataria: 'Banco Itau',
			local_atendimento: 'Agência Balneário Camboriú - 1489',
			operador: 'José da Silva',
			valor_rmc: 'R$ 100,00',
			status: {
				id: 3,
				label: 'Baixada',
			},
		},
		{
			rmc: 9875,
			data: '03/27/2017 - 09:00',
			tipo_rmc: 'Originada',
			cod_autorizacao: '202354012LKM',
			tipo_autorizacao: 'On-line',
			margem_reservada: 'Margem Principal - 5%',
			tipo_consignado: 'Financeiro',
			consignataria: 'Banco do Brasil S/A',
			local_atendimento: 'Agência Balneário Camboriú - 1489',
			operador: 'José da Silva',
			valor_rmc: 'R$ 100,00',
			status: {
				id: 1,
				label: 'Reservada',
			},
		},
		{
			rmc: 4713,
			data: '11/06/2017 - 11:00',
			tipo_rmc: 'Originada',
			cod_autorizacao: '202356154WDS',
			tipo_autorizacao: 'Manual',
			margem_reservada: 'Margem Principal - 10%',
			tipo_consignado: 'Outros',
			consignataria: 'Banco Inter',
			local_atendimento: 'Agência Balneário Camboriú - 1489',
			operador: 'José da Silva',
			valor_rmc: 'R$ 100,00',
			status: {
				id: 4,
				label: 'Cancelada',
			},
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

	// Scripts
	const clearFilter = () => {
		consignacao.value = ''
		consignataria.value = ''
		status.value = ''

		selected.label = ''
		selected.type = ''
	}

	// Computed
	// const disabledButtonClear = computed(() => !!selected.label)
</script>

<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'RMC']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<consultas-titulo
					title="Resumo da RMC - Reserva da Margem de Consignação"
				/>

				<div
					class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto"
				>
					<consultas-popper label="Colunas" :options="cols" />
					<multiselect
						v-model="consignacao"
						:options="['Financeiro', 'Bancario', 'Logista', 'Outros']"
						class="custom-multiselect max-w-[230px]"
						placeholder="Selecione o tipo de consignação"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="
							(selected.label = $event), (selected.type = 'tipo_de_consignacao')
						"
					/>
					<multiselect
						v-model="consignataria"
						:options="[
							'Banco do Brasil S/A',
							'Banco Bradesco',
							'Banco Itau',
							'Banco Inter',
						]"
						class="custom-multiselect max-w-[200px]"
						placeholder="Selecione a Consignatária"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="
							(selected.label = $event), (selected.type = 'consignataria')
						"
					/>
					<multiselect
						v-model="status"
						:options="['Reservada', 'Suspensa', 'Baixada', 'Cancelada']"
						class="custom-multiselect max-w-[200px]"
						placeholder="Selecione a Situação"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'situacao')"
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
