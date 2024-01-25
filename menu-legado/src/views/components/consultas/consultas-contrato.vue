<script lang="ts" setup>
	import { reactive, ref } from 'vue'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'
	import Vue3Datatable from '@bhplugin/vue3-datatable'

	import ConsultasExport from './consultas-export/consultas-export.vue'
	import ConsultasPopper from './consultas-popper/consultas-popper.vue'
	import ConsultasTitulo from './consultas-titulo/consultas-titulo.vue'

	// Icons
	import IconClear from '@icons/iconClear.vue'
	import IconFile from '@icons/iconFile.vue'
	import IconPrinter from '@icons/iconPrinter.vue'

	// Declarações
	const selected = reactive<{ type: string; label: string }>({
		type: '',
		label: '',
	})
	const servico = ref<string>('')
	const consignataria = ref<string>('')
	const status = ref<string>('')
	const cols = reactive([
		{ field: 'rmc', title: 'RMC', hide: false },
		{ field: 'data', title: 'Data', hide: false },
		{ field: 'n_contrato', title: 'Nº Contrato', isUnique: true, hide: false },
		{ field: 'tipo_servico', title: 'Tipo Serviço', hide: false },
		{ field: 'tipo_operacao', title: 'Tipo Operação', hide: false },
		{ field: 'consignataria', title: 'Consignatária', hide: false },
		{ field: 'prazo', title: 'Prazo', hide: false },
		{ field: 'valor_desconto', title: 'Valor Desconto', hide: false },
		{ field: 'tipo_desconto', title: 'Tipo Desconto', hide: false },
		{ field: 'total_desconto', title: 'Total Descontos', hide: false },
		{ field: 'status', title: 'Status', hide: false },
	])
	const rows = reactive([
		{
			rmc: 7079,
			data: '07/18/2017',
			n_contrato: '0800025698',
			tipo_servico: 'Plano de Saúde',
			tipo_operacao: 'Inclusão Nova',
			consignataria: 'ASPM',
			prazo: 'Indeterminado',
			valor_desconto: 'R$ 50,00',
			tipo_desconto: 'Parcela',
			total_desconto: 'R$ 50,00',
			status: {
				id: 3,
				label: 'Encerrado',
			},
		},
		{
			rmc: 7079,
			data: '05/05/2017',
			n_contrato: '032156484',
			tipo_servico: 'Mensalidade',
			tipo_operacao: 'Inclusão Nova',
			consignataria: 'ASPM',
			prazo: '120',
			valor_desconto: 'R$ 100,00',
			tipo_desconto: 'Parcela',
			total_desconto: 'R$ 100,00',
			status: {
				id: 2,
				label: 'Suspenso',
			},
		},
		{
			rmc: 7079,
			data: '03/27/2017',
			n_contrato: '0708206 9605',
			tipo_servico: 'Empréstimos',
			tipo_operacao: 'Portabilidade',
			consignataria: 'ASPM',
			prazo: 'Indeterminado',
			valor_desconto: 'R$ 50,00',
			tipo_desconto: 'Fatura',
			total_desconto: 'R$ 50,00',
			status: {
				id: 1,
				label: 'Ativo',
			},
		},
		{
			rmc: 7079,
			data: '03/27/2017',
			n_contrato: '0708206 9605',
			tipo_servico: 'Compras',
			tipo_operacao: 'Portabilidade',
			consignataria: 'Banco do Brasil S/A',
			prazo: 'Indeterminado',
			valor_desconto: 'R$ 50,00',
			tipo_desconto: 'Fatura',
			total_desconto: 'R$ 50,00',
			status: {
				id: 1,
				label: 'Ativo',
			},
		},
		{
			rmc: 7079,
			data: '03/27/2017',
			n_contrato: '0708206 9605',
			tipo_servico: 'Compras',
			tipo_operacao: 'Portabilidade',
			consignataria: 'Banco Daycoval S/A',
			prazo: 'Indeterminado',
			valor_desconto: 'R$ 50,00',
			tipo_desconto: 'Fatura',
			total_desconto: 'R$ 50,00',
			status: {
				id: 1,
				label: 'Ativo',
			},
		},
		{
			rmc: 7079,
			data: '03/27/2017',
			n_contrato: '0708206 9605',
			tipo_servico: 'Compras/Saque',
			tipo_operacao: 'Portabilidade',
			consignataria: 'Meu CaschCard',
			prazo: 'Indeterminado',
			valor_desconto: 'R$ 50,00',
			tipo_desconto: 'Fatura',
			total_desconto: 'R$ 50,00',
			status: {
				id: 1,
				label: 'Ativo',
			},
		},
	])
	const columns = reactive({
		RMC: 'rmc',
		Data: 'data',
		'Nº Contrato': 'n_contrato',
		'Tipo Serviço': 'tipo_servico',
		'Tipo Operação': 'tipo_operacao',
		Consignatária: 'consignataria',
		Prazo: 'prazo',
		'Valor Desconto': 'valor_desconto',
		'Tipo Desconto': 'tipo_desconto',
		'Total Desconto': 'total_desconto',
		Status: 'status.label',
	})

	// Scripts
	const clearFilter = () => {
		servico.value = ''
		consignataria.value = ''
		status.value = ''

		selected.label = ''
		selected.type = ''
	}

	const color = (id: number | string): string => {
		switch (id) {
			case 1:
				return 'bg-info' // Reservada
			case 2:
				return 'bg-danger' // Suspensa
			case 3:
				return 'bg-secondary' // Baixada
			case 4:
				return 'bg-warning' // Cancelada
			default:
				return '#E0E6ED'
		}
	}

	const filtered = (value: string = '') => {
		if (value === '') return rows

		if (selected.type === 'servico')
			return rows.filter((item: any) => item.tipo_servico === value)

		if (selected.type === 'consignataria')
			return rows.filter((item: any) => item.consignataria === value)

		if (selected.type === 'situacao')
			return rows.filter((item: any) => item.status.label === value)
	}

	// Computed
	// const disabledButtonClear = computed(() => !!selected.label)
</script>

<template>
	<main>
		<breadcrumbs :paginas="['Consultas', 'Contratos']" />

		<div class="panel pb-0 mt-6">
			<div
				class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5"
			>
				<consultas-titulo title="Resumo dos Contratos" />

				<div
					class="header_actions flex items-center gap-5 ltr:ml-auto rtl:mr-auto"
				>
					<consultas-popper label="Colunas" :options="cols" />
					<multiselect
						v-model="consignataria"
						:options="[
							'Banco Daycoval S/A',
							'Meu CaschCard',
							'Banco do Brasil S/A',
							'ASPM',
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
						v-model="servico"
						:options="[
							'Plano de Saúde',
							'Mensalidade',
							'Empréstimos',
							'Compras',
							'Compras/Saque',
						]"
						class="custom-multiselect max-w-[230px]"
						placeholder="Selecione o tipo de serviço"
						:searchable="false"
						:preselect-first="false"
						:allow-empty="false"
						selected-label=""
						select-label=""
						deselect-label=""
						@select="(selected.label = $event), (selected.type = 'servico')"
					/>
					<multiselect
						v-model="status"
						:options="['Encerrado', 'Suspenso', 'Ativo']"
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
							name="resumo-dos-contratos.xls"
							class="text-xs m-1 cursor-pointer"
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

			<div class="datatable">
				<vue3-datatable
					:rows="filtered(selected.label)"
					:columns="cols"
					:total-rows="filtered(selected.label)?.length"
					:sortable="true"
					skin="whitespace-nowrap bh-table-striped"
					no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas"
				>
					<template #rmc="data">
						<button>
							<strong class="text-primary_3-table">{{ data.value.rmc }}</strong>
						</button>
					</template>
					<template #n_contrato="data">
						<button>
							<strong class="text-primary_3-table">{{
								data.value.n_contrato
							}}</strong>
						</button>
					</template>
					<template #status="data">
						<span
							class="flex justify-center badge !w-[80px] h-[22px]"
							:class="color(data.value.status.id)"
							>{{ data.value.status.label }}</span
						>
					</template>
				</vue3-datatable>
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
	}
</style>
