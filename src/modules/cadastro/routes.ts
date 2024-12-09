import { RouteRecordRaw } from "vue-router";
import CadastroConsignantePage from "./pages/CadastroConsignantePage.vue";
import CadastroConsignatariaPage from "./pages/CadastroConsignatariaPage.vue";
import CadastroOperadorPage from "./pages/CadastroOperadorPage.vue";
import CadastroAdministradorPage from "./pages/CadastroAdministradorPage.vue";
import CadastroPerfilOperadorPage from "./pages/CadastroPerfilOperadorPage.vue";
import Operador from "./pages/Operador.vue";
import OperatorRegistrationPage from "./pages/OperatorRegistrationPage.vue"
import MasterConsignerPage from "@/modules/cadastro/pages/MasterConsignerPage.vue";

export const cadastroRoutes: RouteRecordRaw[] = [
  {
    path: '/cadastro',
    name: 'cadastro',
    children: [
      {
        path: 'consignante/:id',
        name: 'cadastro-consignante',
        component: CadastroConsignantePage,
      },
      {
        path: 'consignataria/:id',
        name: 'cadastro-consignataria',
        component: CadastroConsignatariaPage,
      },
			{
        path: 'consignante-master',
        name: 'consultas-consignante-master',
        component: MasterConsignerPage,
      },
      {
        path: 'operadors',
        name: 'cadastro-operador',
        component: CadastroOperadorPage,
      },
      {
        path: 'perfil-operador',
        name: 'cadastro-perfil-operador',
        component: CadastroPerfilOperadorPage,
      },
      {
        path: 'administrador',
        name: 'cadastro-administrador',
        component: CadastroAdministradorPage,
      },
			{
        path: 'operador',
        name: 'operador',
        component: OperatorRegistrationPage,
      },
    ],
  }
]