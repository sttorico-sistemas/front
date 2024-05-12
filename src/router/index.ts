import { createRouter, createWebHistory } from 'vue-router'

import Consultas from '../views/pages/ConsultasPage.vue'
import Dashboard from '../views/pages/DashboardPage.vue'
import Documentos from '../views/pages/DocumentosPage.vue'
import Simulador from '../views/pages/SimuladorPage.vue'
import Cadastro from '../views/pages/CadastroPage.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'dashboard',
			component: Dashboard,
		},
		// Consultas
		{
			path: '/consultas',
			name: 'consultas',
			children: [
				{
					path: 'rmc',
					name: 'consultas-rmc',
					component: Consultas,
				},
				{
					path: 'contratos',
					name: 'consultas-contratos',
					component: Consultas,
				},
				{
					path: 'historico',
					name: 'consultas-historico',
					component: Consultas,
				},
				{
					path: 'consignataria-servidor',
					name: 'consultas-consignataria-servidor',
					component: Consultas,
				},
				{
					path: 'consignataria-admin',
					name: 'consultas-consignataria-admin',
					component: Consultas,
				},
				{
					path: 'atualizacao-margens',
					name: 'consultas-atualizacao-margens',
					component: Consultas,
				},
				{
					path: 'historico-reserva-margem',
					name: 'consultas-historico-reserva-margem',
					component: Consultas,
				},
				{
					path: 'solicitacoes',
					name: 'consultas-solicitacoes',
					component: Consultas,
				},
				{
					path: 'resumo-margem',
					name: 'consultas-resumo-margem',
					component: Consultas,
				},
				{
					path: 'previsao-descontos',
					name: 'consultas-previsao-descontos',
					component: Consultas,
				},
				{
					path: 'consignante-master',
					name: 'consultas-consignante-master',
					component: Consultas,
				},
				{
					path: 'consignantes',
					name: 'consultas-consignantes',
					component: Consultas,
				},
				{
					path: 'pessoas',
					name: 'consultas-pessoas',
					component: Consultas,
				},
			],
		},
		// Simulador
		{
			path: '/simulador',
			name: 'simulador',
			children: [
				{
					path: 'taxa-juros',
					name: 'simulador-taxa-juros',
					component: Simulador,
				},
				{
					path: 'calculadora',
					name: 'simulador-calculadora',
					component: Simulador,
				},
				{
					path: 'emprestimos',
					name: 'simulador-emprestimos',
					component: Simulador,
				},
			],
		},

		// Documentos
		{
			path: '/documentos',
			name: 'documentos',
			children: [
				{
					path: 'arquivados',
					name: 'documentos-arquivados',
					component: Documentos,
				},
			],
		},
		// Cadastro
		{
			path: '/cadastro',
			name: 'cadastro',
			children: [
				{
					path: 'consignante/:id',
					name: 'cadastro-consignante',
					component: Cadastro,
				},
				{
					path: 'consignataria/:id',
					name: 'cadastro-consignataria',
					component: Cadastro,
				},
			],
		},
	],
})

export default router
