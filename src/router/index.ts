import { createRouter, createWebHistory } from 'vue-router'

import Consultas from '../views/pages/ConsultasPage.vue'
import Dashboard from '../views/pages/DashboardPage.vue'
import Documentos from '../views/pages/DocumentosPage.vue'
import Simulador from '../views/pages/SimuladorPage.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'dashboard',
			component: Dashboard,
		},
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
					path: 'consignataria',
					name: 'consultas-consignataria',
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
			],
		},
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
	],
})

export default router
