export type TableURL = ('tipo-endereco' | 'tipo-entidade' | 'tipo-contato' | 'tipo-cobranca') & string

export type Table = {
  id: number;
  name: string;
  url: TableURL;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

