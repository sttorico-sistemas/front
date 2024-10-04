<script lang="ts" setup>
import { reactive, ref } from 'vue'

// Componentes
import ConsultasExport from '../ConsultasExport.vue'
import ImageName from './DatatableColunaImageName.vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'

// Icons
import IconCartaoCreditoServico from 'src/core/components/Icons/Services/IconCartaoCreditoServico.vue'
import IconEmprestimoServico from 'src/core/components/Icons/Services/IconEmprestimosServicos.vue'
import IconFile from 'src/core/components/Icons/IconFile.vue'
import IconMensalidadeServico from 'src/core/components/Icons/Services/IconMensalidadeServicos.vue'
import IconPlanoSaudeServico from 'src/core/components/Icons/Services/IconPlanoSaudeServico.vue'
import IconPrinter from 'src/core/components/Icons/IconPrinter.vue'
import IconSegurosServico from 'src/core/components/Icons/Services/IconSegurosServico.vue'

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
			nome: 'Emprestimo',
			icone: 'emprestimo',
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
			nome: 'Mensalidades',
			icone: 'mensalidades',
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
			nome: 'Cartão Crédito',
			icone: 'cartao-credito',
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
			nome: 'Plano Saúde',
			icone: 'plano-saude',
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

const iconeService = (value: string) => {
	switch (value) {
		case 'emprestimo':
			return IconEmprestimoServico
		case 'compras':
			return ''
		case 'mensalidades':
			return IconMensalidadeServico
		case 'cartao-credito':
			return IconCartaoCreditoServico
		case 'cartao-beneficios':
			return ''
		case 'plano-saude':
			return IconPlanoSaudeServico
		case 'financiamentos':
			return ''
		case 'seguros':
			return IconSegurosServico
		default:
			return 'https://placehold.co/30x30?text=TS'
	}
}
</script>

<template>
	<main>
		<div class="panel py-0">
			<div class="flex flex-wrap justify-between md:items-center md:flex-row flex-col mb-5 gap-5">
				<div class="header_actions w-full justify-end flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
					<div>
						<download-excel v-tippy:top :fields="columns" :data="rows"
							name="resumo-da-rmc_reserva_da_margem-de-consignacao.xls" class="text-xs cursor-pointer">
							<icon-file class="w-5 h-5" />
						</download-excel>
						<tippy target="top" placement="top">Exportar XLS</tippy>
					</div>

					<div class="w-5 h-5">
						<consultas-export v-tippy:top :cols="cols" :rows="rows" filename="Extrato Mensal dos Descontos"
							export-type="print">
							<template #icon>
								<icon-printer class="w-5 h-5" />
							</template>
						</consultas-export>
						<tippy target="top" placement="top">Imprimir</tippy>
					</div>
				</div>
			</div>

			<div class="datatable">
				<vue3-datatable :rows="filterDate()" :columns="cols" :total-rows="rows.length" :sortable="true"
					skin="whitespace-nowrap bh-table-striped mb-5" no-data-content="Nenhum dado foi encontrado"
					pagination-info="Mostrando {0} a {1} de {2} entradas">
					<template #consignataria="data">
						<image-name image="https://placehold.co/30x30" :name="data.value.consignataria.nome" />
					</template>
					<template #tipo_servico="data">
						<image-name v-tippy:top>
							<component :is="iconeService(data.value.tipo_servico.icone)" />
						</image-name>
						<tippy target="top" placement="top">{{
							data.value.tipo_servico.nome
						}}</tippy>
					</template>
					<template #n_contrato="data">
						<strong class="text-primary_3-table">{{
							data.value.n_contrato
						}}</strong>
					</template>
					<template #valor_descontado="data">
						<span :class="formatedCurrency(data.value.valor_descontado).color">{{
							formatedCurrency(data.value.valor_descontado).currency
						}}</span>
					</template>
					<template #saldo_desconto="data">
						<span :class="formatedCurrency(data.value.saldo_desconto).color">{{
							formatedCurrency(data.value.saldo_desconto).currency
						}}</span>
					</template>
					<template #situacao="data">
						<span class="badge block text-center" :class="situacaoColor(data.value.situacao)">{{ data.value.situacao
							}}</span>
					</template>
				</vue3-datatable>
			</div>
		</div>
	</main>
</template>
