export type PaginacaoArgs = {
  page: number;
  limit: number;
};

export type PaginatedResultOutput<T> = {
  items: T[];
  total: number;
};
