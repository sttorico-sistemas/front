import { createRouter, createWebHistory } from 'vue-router'

import { consultasRoutes } from 'src/modules/consultas/routes'
import { cadastroRoutes } from 'src/modules/cadastro/routes'
import { configuracoesRoutes } from 'src/modules/configuracoes/routes'
import { dashboradRoutes } from 'src/modules/dashboard/routes'
import { documentosRoutes } from 'src/modules/documentos/routes'
import { simuladorRoutes } from 'src/modules/simulador/routes'
import { authRoutes } from 'src/modules/auth/routes'
import { useStorage } from '@/core/composables'
import { registersRoutes } from '@/modules/registers/routes'
import { queriesRoutes } from '@/modules/queries/routes'
import { settingsRoutes } from '@/modules/settings/routes'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		...dashboradRoutes,
		// ...consultasRoutes,
		// ...simuladorRoutes,
		// ...documentosRoutes,
		// ...cadastroRoutes,
		...authRoutes,
		...settingsRoutes,
		...registersRoutes,
		...queriesRoutes,
	],
})

router.beforeEach((to, from, next) => {
	const storage = useStorage()

	const authToken = storage.getItem('authToken')
	if (!authToken && to.name !== 'login') {
		next({ name: 'login' })
	} else {
		next()
	}
})

export default router
