import { createRouter, createWebHistory } from 'vue-router'

import { consultasRoutes } from 'src/modules/consultas/routes'
import { cadastroRoutes } from 'src/modules/cadastro/routes'
import { configuracoesRoutes } from 'src/modules/configuracoes/routes'
import { dashboradRoutes } from 'src/modules/dashboard/routes'
import { documentosRoutes } from 'src/modules/documentos/routes'
import { simuladorRoutes } from 'src/modules/simulador/routes'
import { AuthRoutes } from 'src/modules/auth/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...dashboradRoutes,
    ...consultasRoutes,
    ...simuladorRoutes,
    ...documentosRoutes,
    ...configuracoesRoutes,
    ...cadastroRoutes,
    ...AuthRoutes,
  ],
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const authToken = localStorage.getItem('authToken')
  if (!authToken && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
