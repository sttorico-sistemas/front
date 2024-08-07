<script lang="ts" setup>
	import { ref, reactive } from 'vue'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'
	import VueCollapsible from 'vue-height-collapsible/vue3'

	import ConsignatariaHabilitadas from './cadastro-consignataria-habilitadas/cadastro-consignataria-habilitadas.vue'
	import ContratoSistema from './cadastro-contrato-sistema/cadastro-contrato-sistema.vue'
	import DadosConsignante from './cadastro-dados-consignante/cadastro-dados-consignante.vue'
	import ListaAverbadores from './cadastro-lista-averbadores/cadastro-lista-averbadores.vue'
	import ListaGestores from './cadastro-lista-gestores/cadastro-lista-gestores.vue'
	import LogsAlteracao from './logs-alteracao/logs-alteracao.vue'
	import ConsultaConsignante from './cadastro-consulta-consignante/cadastro-consulta-consignante.vue'

	// Icons
	import IconCaretDown from '@icons/iconCaretDown.vue'

	// Declarações
	const accordians = reactive({
		dadosConsignante: false,
		contratoSistema: false,
		gestores: false,
		averbadores: false,
		consignatariaHabilitadas: false,
		logs: false,
	})
	const colsContratoSistema = reactive([
		{ field: 'cod', title: 'Cód. Contrato', hide: false, sort: false, },
		{ field: 'tipo_contrato', title: 'Tipo Contrato', hide: false, sort: false, },
		{ field: 'vigencia', title: 'Vigência', hide: false, sort: false, },
		{ field: 'data_inicial', title: 'Data Inicial', hide: false, sort: false, },
		{ field: 'data_final', title: 'Data Final', hide: false, sort: false, },
		{ field: 'status', title: 'Status', hide: false, sort: false, },
		{ field: 'actions', title: 'Ações', hide: false, sort: false, },
	])
	const rowsContratoSistema = reactive([
		{
      cod: '55622',
      tipo_contrato: 'Contrato Comodato',
      vigencia: '48',
      data_inicial: '23/03/2018',
      data_final: '23/03/2023',
      status: 'Ativo',
    },
    {
      cod: '55632',
      tipo_contrato: 'Acordo de Cooperação Técnica',
      vigencia: '60',
      data_inicial: '23/03/2018',
      data_final: '23/03/2023',
      status: 'Inativo',
    },
	])
	const colsGestores = reactive([
		{ field: 'id', title: '#', hide: true, sort: false, },
		{ field: 'gestor', title: 'Gestores', hide: false, sort: false, },
		{ field: 'cargo', title: 'Cargo', hide: false, sort: false, },
		{ field: 'telefone', title: 'Telefone', hide: false, sort: false, },
		{ field: 'celular', title: 'Celular', hide: false, sort: false, },
		{ field: 'email', title: 'E-mail', hide: false, sort: false, },
		{ field: 'actions', title: 'Ações', hide: false, sort: false, },
	])
	const rowsGestores = reactive([
		{
			id: 1,
      gestor: 'João Carlos de Oliveira Carvalho',
      cargo: 'Secretário de Administração e Finanças',
      telefone: '(47) 3322-4455',
      celular: '(47) 9991-4455',
      email: 'financas@prefeitura.sc.gov.br',
			status: 'Ativo',
    },
    {
			id: 2,
      gestor: 'Mário José da Silva Chavier',
      cargo: 'Prefeito Municipal',
      telefone: '(47) 3322-4455',
      celular: '(47) 9991-4455',
      email: 'gabinete@prefeitura.sc.gov.br',
			status: 'Inativo',
    },
	])
	const colsConsignatesHabilitadas = reactive([
		{ field: 'id', title: '#', hide: false, sort: false },
		{ field: 'consignataria', title: 'Consignatária', hide: false },
		{ field: 'tipo_instituicao', title: 'Tipo Instituição', hide: false },
		{ field: 'tipo_servicos', title: 'Tipo de Serviços', hide: false },
		{ field: 'data_habilitacao', title: 'Data Habilitação', hide: false },
		{ field: 'data_renovação', title: 'Data Renovação', hide: false },
		{ field: 'status', title: 'Status', hide: false },
		{ field: 'averbacao', title: 'Averbação', hide: false },
		{ field: 'habilitacao', title: 'Habilitação', hide: false },
		{ field: 'actions', title: 'Ações', hide: false, sort: false },
	])
	const rowsConsignatesHabilitadas = reactive([
		{
      id: 1,
			consignataria: {
				nome: 'Banco do Brasil',
				tipo: 'Instituição Financeira',
				icone: '',
			},
			tipo_instituicao: 'Instituição Financeira',
			tipo_servicos: [
				{
					nome: 'Emprestimo',
					icone: 'emprestimo',
				},
			],
      data_habilitacao: '23/03/2020',
      data_renovação: '23/03/2021',
			status: 'Inativo',
      averbacao: 'Bloqueada',
			habilitacao: 'Desabilitado',
		},
		{
      id: 2,
			consignataria: {
				nome: 'Banco Daycoval',
				tipo: 'Associação',
				icone: '',
			},
			tipo_instituicao: 'Cooperativa de Crédito',
			tipo_servicos: [
				{
					nome: 'Emprestimo',
					icone: 'emprestimo',
				},
				{
					nome: 'Mensalidade',
					icone: 'mensalidades',
				},
				{
					nome: 'Plano de Saúde',
					icone: 'plano-saude',
				},
        {
					nome: 'Seguro',
					icone: 'seguros',
				},
			],
			data_habilitacao: '15/10/2021',
      data_renovação: '15/10/2022',
			status: 'Ativo',
      averbacao: 'Liberada',
			habilitacao: 'Habilitado',
		},
	])

	// Script

</script>
<template>
	<main>
		<breadcrumbs :paginas="['Cadastro', 'Consignante']" />

		<consulta-consignante />

		<div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
				@click="accordians.dadosConsignante === true ? (accordians.dadosConsignante = false) : (accordians.dadosConsignante = true)"
			>
				Dados do Consignante
				<div
					:class="{ 'rotate-180': accordians.dadosConsignante === true }"
				>
						<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.dadosConsignante === true">
				<dados-consignante />
			</vue-collapsible>
		</div>

		<div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
				@click="accordians.contratoSistema === true ? (accordians.contratoSistema = false) : (accordians.contratoSistema = true)"
			>
				Contratos Sistema
				<div
					:class="{ 'rotate-180': accordians.contratoSistema === true }"
				>
						<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.contratoSistema === true">
				<contrato-sistema
					:cols="colsContratoSistema"
					:rows="rowsContratoSistema"
				/>
			</vue-collapsible>
		</div>
		<div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
				@click="accordians.gestores === true ? (accordians.gestores = false) : (accordians.gestores = true)"
			>
				Lista de Gestores
				<div
					:class="{ 'rotate-180': accordians.gestores === true }"
				>
						<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.gestores === true">
				<lista-gestores
					:cols="colsGestores"
					:rows="rowsGestores"
				/>
			</vue-collapsible>
		</div>
		<div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
				@click="accordians.averbadores === true ? (accordians.averbadores = false) : (accordians.averbadores = true)"
			>
				Lista de Averbadores
				<div
					:class="{ 'rotate-180': accordians.averbadores === true }"
				>
						<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.averbadores === true">
				<lista-averbadores />
			</vue-collapsible>
		</div>
		<div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
				@click="accordians.consignatariaHabilitadas === true ? (accordians.consignatariaHabilitadas = false) : (accordians.consignatariaHabilitadas = true)"
			>
				Consignatárias Habilitadas
				<div
					:class="{ 'rotate-180': accordians.consignatariaHabilitadas === true }"
				>
					<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.consignatariaHabilitadas === true">
				<consignataria-habilitadas
					:cols="colsConsignatesHabilitadas"
					:rows="rowsConsignatesHabilitadas"
					title="Consignatárias Habilitadas"
				/>
			</vue-collapsible>
		</div>
		<div class="mt-6 border border-slate-50 shadow-md rounded-md bg-[#f6f8fa]">
			<button
				type="button"
				class="p-4 w-full flex justify-between items-center text-lg bg-[#f6f8fa]"
				@click="accordians.logs === true ? (accordians.logs = false) : (accordians.logs = true)"
			>
				Logs
				<div
					:class="{ 'rotate-180': accordians.logs === true }"
				>
					<icon-caret-down />
				</div>
			</button>
			<vue-collapsible :isOpen="accordians.logs === true">
				<logs-alteracao />
			</vue-collapsible>
		</div>
	</main>
</template>
<style lang="scss" scoped></style>
