import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/pages/DashboardPage.vue'
import Consultas from '../views/pages/ConsultasPage.vue'

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
			component: Consultas,
		},
	],
})

export default router
