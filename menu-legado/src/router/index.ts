import { createRouter, createWebHistory } from 'vue-router'

import Consultas from '../views/pages/ConsultasPage.vue'
import Dashboard from '../views/pages/DashboardPage.vue'

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
			],
		},
	],
})

export default router
