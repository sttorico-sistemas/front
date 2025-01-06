import { ConsignerData, EndorserData, RegulatoryData, InstructionOfProcedureData, ManagerData } from "@/modules/registers/ConsignerPage/components/table";
import AnnotationData from "@/modules/registers/ConsignerPage/components/table/AnnotationData.vue";
import LogData from "@/modules/registers/ConsignerPage/components/table/LogData.vue";
import OperatorData from "@/modules/registers/ConsignerPage/components/table/OperatorData.vue";

export const accordionItems = [
	{
		value: 'item-1',
		title: 'Dados do consignante',
		component: ConsignerData,
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
		title: 'Lista de averbadores',
		component: EndorserData,
		disabled: false
	},
	{
		value: 'item-5',
		title: 'Perfil de acesso para operadores',
		component: null,
		disabled: true
	},
	{
		value: 'item-6',
		title: 'Consignatárias habilitadas',
		component: null,
		disabled: true
	},
	{
		value: 'item-7',
		title: 'Operadores',
		component: OperatorData,
		disabled: false
	},
	{
		value: 'item-8',
		title: 'Normativos',
		component: RegulatoryData,
		disabled: false
	},
	{
		value: 'item-9',
		title: 'Consignações',
		component: null,
		disabled: true
	},
	{
		value: 'item-10',
		title: 'Margem consignável',
		component: null,
		disabled: true
	},
	{
		value: 'item-11',
		title: 'Regulamento',
		component: null,
		disabled: true
	},
	{
		value: 'item-12',
		title: 'Restrições',
		component: null,
		disabled: true
	},
	{
		value: 'item-13',
		title: 'IP - Instrução de procedimentos',
		component: InstructionOfProcedureData,
		disabled: false
	},
	{
		value: 'item-14',
		title: 'Anotações',
		component: AnnotationData,
		disabled: false
	},
	{
		value: 'item-15',
		title: 'Logs',
		component: LogData,
		disabled: false
	},
]