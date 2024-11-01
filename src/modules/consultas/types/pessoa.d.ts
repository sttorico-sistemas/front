import { Endereco } from "./endereco";
import { Contato } from "./contato";

export interface Pessoa {
	id: number;
	cpf: string;
	nome: string;
	tpVinculo: string;
	contratante: string;
	cidade?: string;
	email?: string;
	status?: string;
	contatos: Contato[];
	enderecos: Endereco[];
}