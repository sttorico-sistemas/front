export type MargemDetalhamento = {
  financeiro: number;
	convenios: number;
	cartao_credito: number;
	cartao_beneficios: number;
}

export type Margem = {
  id: number;
	titulo: string;
	valor: number;
	porcentagem: number;
	total_reservado?: number;
	detalhamento?: MargemDetalhamento;
}