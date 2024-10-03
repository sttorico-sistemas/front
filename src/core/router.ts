import { createRouter, createWebHistory } from 'vue-router'

import { consultasRoutes } from 'src/modules/consultas/routes'
import { cadastroRoutes } from 'src/modules/cadastro/routes'
import { configuracoesRoutes } from 'src/modules/configuracoes/routes'
import { dashboradRoutes } from 'src/modules/dashboard/routes'
import { documentosRoutes } from 'src/modules/documentos/routes'
import { simuladorRoutes } from 'src/modules/simulador/routes'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		...dashboradRoutes,
		...consultasRoutes,
		...simuladorRoutes,
		...documentosRoutes,
		...configuracoesRoutes,
		...cadastroRoutes,
	],
})

export default router
