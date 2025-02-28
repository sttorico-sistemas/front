import { RouteRecordRaw } from "vue-router";
import { AuxiliaryTablesPage } from "@/modules/settings/AuxiliaryTablesPage";
import { RouteManagementPage } from "@/modules/settings/RouteManagementPage";
import { ServicePage } from "@/modules/settings/ServicePage";
import { RulePage } from "@/modules/settings/RulePage";
import { IamPage } from "@/modules/settings/IAMPage";
import { GEDPage } from "@/modules/settings/GEDPage";

export const settingsRoutes: RouteRecordRaw[] = [
	{
		path: '/configuracoes',
		name: 'configuracoes',
		children: [
			{
				path: 'tabelas-auxiliares',
				name: 'configuracoes-tabelas-auxiliares',
				component: AuxiliaryTablesPage,
			},
			{
				path: 'servicos',
				name: 'configuracoes-servicos',
				component: ServicePage,
			},
			{
				path: 'paginas',
				name: 'configuracoes-paginas',
				component: RouteManagementPage,
			},
			{
				path: 'tipo-de-operador',
				name: 'configuracoes-tipo-de-operador',
				component: IamPage,
			},
			{
				path: 'regras',
				name: 'configuracoes-regras',
				component: RulePage,
			},
			{
				path: 'ged',
				name: 'configuracoes-ged',
				component: GEDPage,
			},
		],
	}
]