import { ConsignerAdminData, EndorserData, RegulatoryData, InstructionOfProcedureData, ManagerData, } from "@/modules/registers/ConsignerAdminPage/components/table";
import AnnotationData from "@/modules/registers/ConsignerAdminPage/components/table/AnnotationData.vue";
import LogData from "@/modules/registers/ConsignerAdminPage/components/table/LogData.vue";
import OperatorData from "@/modules/registers/ConsignerAdminPage/components/table/OperatorData.vue";

export const accordionItems = [
	{
		value: 'item-1',
		title: 'Dados da consignatária',
		component: ConsignerAdminData,
		disabled: false
	},
	{
		value: 'item-2',
		title: 'Contratos sistema',
		component: null,
		disabled: true
	},
	{
		value: 'item-3',
		title: 'Lista de gestores',
		component: ManagerData,
		disabled: false
	},
	{
		value: 'item-4',
		title: 'Backoffice',
		component: null,
		disabled: true
	},
	{
		value: 'item-5',
		title: 'Pontos de Venda',
		component: null,
		disabled: true
	},
	{
		value: 'item-6',
		title: 'Operadores',
		component: OperatorData,
		disabled: false
	},
	{
		value: 'item-7',
		title: 'Perfil de Acesso Para Operadores',
		component: null,
		disabled: true
	},
	{
		value: 'item-8',
		title: 'Consignantes Habilitados',
		component: null,
		disabled: true
	},
	{
		value: 'item-9',
		title: 'Normativos',
		component: RegulatoryData,
		disabled: false
	},
	{
		value: 'item-10',
		title: 'Regras de Serviço',
		component: null,
		disabled: true
	},
	{
		value: 'item-11',
		title: 'Restrições',
		component: null,
		disabled: true
	},
	{
		value: 'item-12',
		title: 'IP - Instrução de procedimentos',
		component: InstructionOfProcedureData,
		disabled: false
	},
	{
		value: 'item-13',
		title: 'Anotações',
		component: AnnotationData,
		disabled: false
	},
	{
		value: 'item-14',
		title: 'Logs',
		component: LogData,
		disabled: false
	},
]