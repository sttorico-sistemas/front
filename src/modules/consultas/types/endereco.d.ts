import { Cidade } from "./cidade";

export interface Endereco {
	id: number;
	logradouro: string;
	cep: string;
	cidadeId: number;
	tipoEnderecoId: number;
	cidade: Cidade;
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date;
}