import { RouteRecordRaw } from "vue-router";
import TabelasPage from "./pages/TabelasPage.vue";
import LogomarcasPage from "./pages/LogomarcasPage.vue";

export const configuracoesRoutes: RouteRecordRaw[] = [
  {
    path: '/configuracoes',
    name: 'configuracoes',
    children: [
      {
        path: 'tabelas-auxiliares',
        name: 'configuracoes-tabelas-auxiliares',
        component: TabelasPage,
      },
      {
        path: 'logomarcas',
        name: 'configuracoes-logomarcas',
        component: LogomarcasPage,
      },
    ],
  },
]