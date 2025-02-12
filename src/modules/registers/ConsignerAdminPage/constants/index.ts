import {
	ConsignerAdminData,
	RegulatoryData,
	InstructionOfProcedureData,
	ManagerData,
	LogData,
	AnnotationData,
	OperatorData,
	BackOfficeData,
	SalePointData
} from "@/modules/registers/ConsignerAdminPage/components/table";

export const accordionItems = [
	{
		value: 'item-1',
		title: 'Dados da Consignatária',
		component: ConsignerAdminData,
		disabled: false
	},
	{
		value: 'item-2',
		title: 'Contratos Sistema',
		component: null,
		disabled: true
	},
	{
		value: 'item-3',
		title: 'Lista de Gestores',
		component: ManagerData,
		disabled: false
	},
	{
		value: 'item-4',
		title: 'Back Office',
		component: BackOfficeData,
		disabled: false
	},
	{
		value: 'item-5',
		title: 'Pontos de Venda',
		component: SalePointData,
		disabled: false
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
		title: 'IP - Instrução de Procedimentos',
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