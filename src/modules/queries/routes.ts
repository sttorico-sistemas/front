import { RouteRecordRaw } from "vue-router";
import { OperatorRegistrationPage } from "@/modules/queries/OperatorRegistrationPage";


export const queriesRoutes: RouteRecordRaw[] = [
	{
		path: '/consultas',
		name: 'consultas',
		children: [
			{
				path: 'operadores',
				name: 'consultas-operadores',
				component: OperatorRegistrationPage,
			},
		],
	}
]