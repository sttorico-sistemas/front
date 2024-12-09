export type PaginationLinks = {
	first: string
	last: string
	prev: any
	next: string
}

export type PaginationMeta = {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export type ResponseApiPagination<T> = {
  data: T[]
  links: PaginationLinks
  meta: PaginationMeta
}