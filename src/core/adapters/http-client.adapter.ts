import Axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from 'axios'
import { Router } from 'vue-router'

import {
	HttpClient,
	Notify,
	HttpClientProperties,
	HttpClientRoute,
	HttpClientConfig,
	Storage
} from '@/core/types'

export class AxiosHttpClientAdapter implements HttpClient {
	private readonly httpInstance: AxiosInstance
	private storageInstance?: Storage | undefined
	private routerInstance?: Router | undefined
	private notifyInstance?: Notify | undefined
	static #instance: AxiosHttpClientAdapter
	private readonly GLOBAL_ROUTES = ['/login']

	private constructor(private readonly properties?: HttpClientProperties) {
		this.httpInstance = Axios.create({ baseURL: this.properties?.baseUrl })
		this.httpInstance.interceptors.response.use(
			this.successResponseInterceptor.bind(this),
			this.failResponseInterceptor.bind(this),
		)
		this.httpInstance.interceptors.request.use(
			this.successRequestInterceptor.bind(this),
			this.failRequestInterceptor.bind(this),
		)
	}

	public static createInstance(
		properties?: HttpClientProperties,
	): AxiosHttpClientAdapter {
		if (!AxiosHttpClientAdapter.#instance) {
			AxiosHttpClientAdapter.#instance = new AxiosHttpClientAdapter(properties)
		}

		return AxiosHttpClientAdapter.#instance
	}

	async get<TResponse extends any>(
		path: HttpClientRoute,
		config?: HttpClientConfig,
	): Promise<TResponse> {
		return this.httpInstance
			.get<TResponse>(path, config)
			.then(response => response.data)
	}

	async post<TResponse extends any, TBody>(
		path: HttpClientRoute,
		data: TBody,
		config?: HttpClientConfig,
	): Promise<TResponse> {
		return this.httpInstance
			.post<TResponse>(path, data, config)
			.then(response => response.data)
	}

	async put<TResponse  extends any, TBody>(
		path: HttpClientRoute,
		data: TBody,
		config?: HttpClientConfig,
	): Promise<TResponse> {
		return this.httpInstance
			.put<TResponse>(path, data, config)
			.then(response => response.data)
	}

	async patch<TResponse extends any, TBody>(
		path: HttpClientRoute,
		data: TBody,
		config?: HttpClientConfig,
	): Promise<TResponse> {
		return this.httpInstance
			.patch<TResponse>(path, data, config)
			.then(response => response.data)
	}

	async delete<TResponse extends any>(
		path: HttpClientRoute,
		config?: HttpClientConfig,
	): Promise<TResponse> {
		return this.httpInstance
			.delete<TResponse>(path, config)
			.then(response => response.data)
	}

	set router(instance: Router) {
		this.routerInstance = instance
	}

	set storage(instance: Storage) {
		this.storageInstance = instance
	}

	set notify(instance: Notify) {
		this.notifyInstance = instance
	}

	private gotTo(name: string) {
		const router = this.routerInstance
		if (!router) return
		return function () {
			router.push({ name: name })
		}
	}

	private async successResponseInterceptor(
		response: AxiosResponse,
	) {
		return response
	}

	private async failResponseInterceptor(
		error: AxiosError<unknown>,
	) {
		if (error?.response && this.routerInstance) {
			if (error?.response.status === 401) {
				this.notifyInstance?.error(error, {
					title: 'Erro',
					description: 'Você precisa estar autenticado. Por favor, faça o login.'
				}, {
					buttonText: 'Continuar',
					hasButton: true,
					onClick: this.gotTo('login'),
				})

				return Promise.reject(error);
			}

			if (error?.response.status === 403) {
				this.notifyInstance?.error(error, {
					title: 'Erro',
					description: 'Você não tem acesso a essa função. Cano necessário, entre em contato com seu administrador.'
				}, {
					buttonText: 'Continuar',
					hasButton: true,
					onClick: this.gotTo('dashboard'),
				})
				return Promise.reject(error);
			}
		}

		return Promise.reject(error)
	}

	private async successRequestInterceptor(config: InternalAxiosRequestConfig) {
		if (this.storageInstance && this.routerInstance) {
			const authToken = this.storageInstance.getItem('authToken')
			console.log(authToken)

			if (!authToken && !(!config.url || !this.GLOBAL_ROUTES.includes(config.url))) {
				const controller = new AbortController();
				config.signal = controller.signal
				this.notifyInstance?.error(null, {
					title: 'Erro',
					description: 'Você precisa estar autenticado. Por favor, faça o login.'
				}, {
					buttonText: 'Continuar',
					hasButton: true,
					onClick: this.gotTo('login'),
				})
				controller.abort()
			}

			console.log(authToken)

			config.headers.Authorization = `Bearer ${authToken}`
		}

		return config
	}

	private async failRequestInterceptor(error: unknown) {
		return error
	}
}
