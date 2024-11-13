import { Endereco } from "src/modules/consultas/types/endereco";

export type Expediente = {
	de: string;
	ate: string;
};

export interface Consignante {
	id: number;
	consignanteMasterId: number;
	tipoEntidadeId: number;
	cnpj: string;
	nome: string;
	nomeCurto: string;
	status: string;
	averbacao: string;
	dtInicial: string;
	dtFinal: string;
	enderecos: Endereco[];
	expediente: Expediente;
}
