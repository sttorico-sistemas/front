export interface Cidade {
  id: number;
  nome: string;
  estadoId: number;
  ibgeId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}