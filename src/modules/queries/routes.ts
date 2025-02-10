import { RouteRecordRaw } from "vue-router";
import { OperatorRegistrationPage } from "@/modules/queries/OperatorRegistrationPage";
import { PersonPage } from "@/modules/queries/PersonPage";


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
			{
				path: 'pessoas',
				name: 'consultas-pessoas',
				component: PersonPage,
			},
		],
	}
]