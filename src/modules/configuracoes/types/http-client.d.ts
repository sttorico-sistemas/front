import { PaginationMeta } from "@/modules/configuracoes/types/pagination"

export type HttpClientProps<T> = {
	params?: Record<string, unknown>,
	signal?: AbortSignal
	metaCallback?: (meta: PaginationMeta, data: T) => void
}