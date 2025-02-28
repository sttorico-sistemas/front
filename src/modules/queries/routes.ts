import { RouteRecordRaw } from "vue-router";
import { OperatorRegistrationPage } from "@/modules/queries/OperatorRegistrationPage";
import { PersonPage } from "@/modules/queries/PersonPage";
import { RMCPage } from "@/modules/queries/RMCPage";
import { DiscountHistoryPage } from "@/modules/queries/DiscountHistoryPage";


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
			{
				path: 'historico-de-descontos',
				name: 'consultas-historico-de-descontos',
				component: DiscountHistoryPage,
			},
			{
				path: 'rmc',
				name: 'consultas-rmc',
				component: RMCPage,
			},
		],
	}
]