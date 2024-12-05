import { PaginationMeta } from "@/core/types/pagination"

export type HttpClientRoute = string

export type HttpClientProps<T> = {
	params?: Record<string, unknown>,
	signal?: AbortSignal
	metaCallback?: (meta: PaginationMeta, data: T) => void
}

export type HttpClientConfig = {
	signal?: AbortSignal
	params?: Record<string, unknown>
	headers?: Record<string, any>
}

export type HttpClientProperties = {
	baseUrl: string
}

export interface HttpClient {
	get: <TResponse extends any>(
		path: HttpClientRoute,
		config?: HttpClientConfig,
	) => Promise<TResponse>
	post: <TResponse extends any, TBody>(
		path: HttpClientRoute,
		data: TBody,
		config?: HttpClientConfig,
	) => Promise<TResponse>
	put: <TResponse extends any, TBody>(
		path: HttpClientRoute,
		data: TBody,
		config?: HttpClientConfig,
	) => Promise<TResponse>
	patch: <TResponse extends any, TBody>(
		path: HttpClientRoute,
		data: TBody,
		config?: HttpClientConfig,
	) => Promise<TResponse>,
	delete: <TResponse extends any>(
		path: HttpClientRoute,
		config?: HttpClientConfig,
	) => Promise<TResponse>
}
