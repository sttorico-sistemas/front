import { RouteRecordRaw } from "vue-router";
import RmcPage from "./pages/RmcPage.vue";
import ContratosPage from "./pages/ContratosPage.vue";
import HistoricoPage from "./pages/HistoricoPage.vue";
import ConsignatariaServidorPage from "./pages/ConsignatariaServidorPage.vue";
import ConsignatariaAdminPage from "./pages/ConsignatariaAdminPage.vue";
import AtualizacaoMargensPage from "./pages/AtualizacaoMargensPage.vue";
import HistoricoReservaPage from "./pages/HistoricoReservaPage.vue";
import SolicitacoesPage from "./pages/SolicitacoesPage.vue";
import ResumoMargemPage from "./pages/ResumoMargemPage.vue";
import PrevisaoDescontosPage from "./pages/PrevisaoDescontosPage.vue";
import ConsignanteMasterPage from "./pages/ConsignanteMasterPage.vue";
import ConsignantesPage from "./pages/ConsignantesPage.vue";
import ConsignadorPage from "./pages/ConsignadorPage.vue";
import PessoasCadastradasPage from "./pages/PessoasCadastradasPage.vue";
import Operador from "../cadastro/pages/Operador.vue";

export const consultasRoutes: RouteRecordRaw[] = [
  {
    path: '/consultas',
    name: 'consultas',
    children: [
      {
        path: 'rmc',
        name: 'consultas-rmc',
        component: RmcPage,
      },
      {
        path: 'contratos',
        name: 'consultas-contratos',
        component: ContratosPage,
      },
      {
        path: 'historico',
        name: 'consultas-historico',
        component: HistoricoPage,
      },
      {
        path: 'consignataria-servidor',
        name: 'consultas-consignataria-servidor',
        component: ConsignatariaServidorPage,
      },
      {
        path: 'consignataria-admin',
        name: 'consultas-consignataria-admin',
        component: ConsignatariaAdminPage,
      },
      {
        path: 'atualizacao-margens',
        name: 'consultas-atualizacao-margens',
        component: AtualizacaoMargensPage,
      },
      {
        path: 'historico-reserva-margem',
        name: 'consultas-historico-reserva-margem',
        component: HistoricoReservaPage,
      },
      {
        path: 'solicitacoes',
        name: 'consultas-solicitacoes',
        component: SolicitacoesPage,
      },
      {
        path: 'resumo-margem',
        name: 'consultas-resumo-margem',
        component: ResumoMargemPage,
      },
      {
        path: 'previsao-descontos',
        name: 'consultas-previsao-descontos',
        component: PrevisaoDescontosPage,
      },
      {
        path: 'consignante-master',
        name: 'consultas-consignante-master',
        component: ConsignanteMasterPage,
      },
      {
        path: 'consignantes',
        name: 'consultas-consignantes',
        component: ConsignantesPage,
      },
      {
        path: 'pessoas',
        name: 'consultas-pessoas',
        component: PessoasCadastradasPage,
      },
      {
        path: 'consignador',
        name: 'consultas-consignador',
        component: ConsignadorPage,
      },
      {
        path: 'operador',
        name: 'operador',
        component: Operador,
      },
    ]
  }
];