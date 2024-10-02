import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/pages/DashboardPage.vue'
import Documentos from '../views/pages/DocumentosPage.vue'
import Simulador from '../views/pages/SimuladorPage.vue'
import Cadastro from '../views/pages/CadastroPage.vue'
import Configuracoes from '../views/pages/ConfiguracoesPage.vue'
import { consultasRoutes } from 'src/modules/consultas/routes'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'dashboard',
			component: Dashboard,
		},
		...consultasRoutes,
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
		// Configuracoes
		{
			path: '/configuracoes',
			name: 'configuracoes',
			children: [
				{
					path: 'tabelas-auxiliares',
					name: 'configuracoes-tabelas-auxiliares',
					component: Configuracoes,
				},
				{
					path: 'logomarcas',
					name: 'configuracoes-logomarcas',
					component: Configuracoes,
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
				{
					path: 'operador',
					name: 'cadastro-operador',
					component: Cadastro,
				},
				{
					path: 'perfil-operador',
					name: 'cadastro-perfil-operador',
					component: Cadastro,
				},
				{
					path: 'administrador',
					name: 'cadastro-administrador',
					component: Cadastro,
				},
			],
		},
	],
})

export default router
