import { RouteRecordRaw } from "vue-router";
import TabelasPage from "./pages/TabelasPage.vue";
import LogomarcasPage from "./pages/LogomarcasPage.vue";
import PaginaPage from "./pages/PaginaPage.vue";
import PerfilPage from "./pages/PerfilPage.vue";
import ComponentesPage from "./pages/ComponentesPage.vue";

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
      {
        path: 'paginas',
        name: 'paginas',
        component: PaginaPage,
      },
      {
        path: 'componentes',
        name: 'componentes',
        component: ComponentesPage,
      },
      {
        path: 'perfil',
        name: 'perfil',
        component: PerfilPage,
      },
    ],
  },
]