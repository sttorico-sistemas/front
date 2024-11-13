import { RouteRecordRaw } from "vue-router";
import TaxaJurosPage from "./pages/TaxaJurosPage.vue";
import CalculadoraPage from "./pages/CalculadoraPage.vue";
import EmprestimosPage from "./pages/EmprestimosPage.vue";

export const simuladorRoutes: RouteRecordRaw[] = [
  {
    path: '/simulador',
    name: 'simulador',
    children: [
      {
        path: 'taxa-juros',
        name: 'simulador-taxa-juros',
        component: TaxaJurosPage,
      },
      {
        path: 'calculadora',
        name: 'simulador-calculadora',
        component: CalculadoraPage,
      },
      {
        path: 'emprestimos',
        name: 'simulador-emprestimos',
        component: EmprestimosPage,
      },
    ],
  },
]