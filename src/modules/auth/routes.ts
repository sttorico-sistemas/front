import { RouteRecordRaw } from "vue-router";
import LoginPage from "./page/LoginPage.vue";

export const authRoutes: RouteRecordRaw[] = [
    {

        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: { noHeaderFooter: true },
    }

]