import { RouteRecordRaw } from "vue-router";
import DashboardPage from "./pages/DashboardPage.vue";

export const dashboradRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardPage,
  },
]