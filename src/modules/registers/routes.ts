import { RouteRecordRaw } from "vue-router";
import { MasterConsignerPage } from "@/modules/registers/MasterConsignerPage";
import { ConsignerDetailPage, ConsignerPage } from "@/modules/registers/ConsignerPage";
import { ConsignerAdminDetailPage, ConsignerAdminPage } from "@/modules/registers/ConsignerAdminPage";


export const registersRoutes: RouteRecordRaw[] = [
	{
		path: '/cadastros',
		name: 'cadastros',
		children: [
			{
				path: 'consignantes-master',
				name: 'cadastros-consignantes-master',
				component: MasterConsignerPage,
			},
			{
				path: 'consignantes',
				name: 'cadastros-consignantes',
				component: ConsignerPage,
			},
			{
				path: 'consignatarias-admin',
				name: 'cadastros-consignatarias-admin',
				component: ConsignerAdminPage,
			},
			{
				path: 'consignantes/:id',
				name: 'cadastros-consignantes-detail',
				component: ConsignerDetailPage,
			},
			{
				path: 'consignatarias/:id',
				name: 'cadastros-consignatarias-detail',
				component: ConsignerAdminDetailPage,
			},
		],
	}
]