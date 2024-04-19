<script lang="ts" setup>
	import { ref, reactive } from 'vue'

	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'

	import ConsignatariaHabilitadas from './cadastro-consignataria-habilitadas/cadastro-consignataria-habilitadas.vue'
	import ContratoSistema from './cadastro-contrato-sistema/cadastro-contrato-sistema.vue'
	import DadosConsignante from './cadastro-dados-consignante/cadastro-dados-consignante.vue'
	import ListaAverbadores from './cadastro-lista-averbadores/cadastro-lista-averbadores.vue'
	import ListaGestores from './cadastro-lista-gestores/cadastro-lista-gestores.vue'
	import LogsAlteracao from './logs-alteracao/logs-alteracao.vue'

	// Icons

	// Declarações
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
    },
    {
			id: 2,
      gestor: 'Mário José da Silva Chavier',
      cargo: 'Prefeito Municipal',
      telefone: '(47) 3322-4455',
      celular: '(47) 9991-4455',
      email: 'gabinete@prefeitura.sc.gov.br',
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
		},
	])

	// Script

</script>
<template>
	<main>
		<breadcrumbs :paginas="['Cadastro', 'Consignante']" />

    <dados-consignante />
    <contrato-sistema
			:cols="colsContratoSistema"
			:rows="rowsContratoSistema"
		/>
    <lista-gestores
			:cols="colsGestores"
			:rows="rowsGestores"
		/>
    <lista-averbadores />
    <consignataria-habilitadas
			:cols="colsConsignatesHabilitadas"
			:rows="rowsConsignatesHabilitadas"
		/>
    <logs-alteracao />
	</main>
</template>
<style lang="scss" scoped></style>
