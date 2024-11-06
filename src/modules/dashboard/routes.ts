import { RouteRecordRaw } from "vue-router";
// import DashboardPage from "./pages/DashboardPage.vue";
import Empty from "src/core/components/Empty.vue";

export const dashboradRoutes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'dashboard',
		// component: DashboardPage,
		component: Empty,
	},
]