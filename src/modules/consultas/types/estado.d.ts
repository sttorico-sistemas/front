import { Cidade } from "./cidade";

export type EstadoUf =
	| 'RO'
	| 'AC'
	| 'AM'
	| 'RR'
	| 'PA'
	| 'AP'
	| 'TO'
	| 'MA'
	| 'PI'
	| 'CE'
	| 'RN'
	| 'PB'
	| 'PE'
	| 'AL'
	| 'SE'
	| 'BA'
	| 'MG'
	| 'ES'
	| 'RJ'
	| 'SP'
	| 'PR'
	| 'SC'
	| 'RS'
	| 'MS'
	| 'MT'
	| 'GO'
	| 'DF';

export type EstadoCidades = {
	[key in EstadoUf]?: Cidade[];
};

export interface Estado {
	id: number;
	nome: string;
	uf: EstadoUf;
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date;
	ibgeId: number;
}