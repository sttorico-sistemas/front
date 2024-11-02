import { Estado } from "./estado";

export interface Cidade {
	id: number;
	nome: string;
	estadoId: number;
	ibgeId: number;
	estado?: Estado;
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date;
}