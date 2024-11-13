import { RouteRecordRaw } from "vue-router";
import ArquivadosPage from "./pages/ArquivadosPage.vue";

export const documentosRoutes: RouteRecordRaw[] = [
  {
    path: '/documentos',
    name: 'documentos',
    children: [
      {
        path: 'arquivados',
        name: 'documentos-arquivados',
        component: ArquivadosPage,
      },
    ],
  },
]