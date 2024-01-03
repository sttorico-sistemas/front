import { createRouter, createWebHistory } from 'vue-router'

import Consultas from '../views/pages/ConsultasPage.vue'
import Contratos from '../views/pages/ConsultasContratoPage.vue'
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
			path: '/consultas/rmc',
			name: 'consultas',
			component: Consultas,
		},
		{
			path: '/consultas/contratos',
			name: 'contratos',
			component: Contratos,
		},
	],
})

export default router
