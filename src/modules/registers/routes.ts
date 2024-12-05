import { RouteRecordRaw } from "vue-router";
import { MasterConsignerPage } from "@/modules/registers/MasterConsignerPage";
import { PersonPage } from "@/modules/registers/PersonPage";


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
				path: 'pessoas',
				name: 'cadastros-pessoas',
				component: PersonPage,
			},
		],
	}
]