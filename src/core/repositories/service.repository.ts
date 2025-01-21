import { useAxios } from "@/core/composables";
import { BaseError } from "@/core/errors/base.error";
import { ServiceModel } from "@/core/models";
import { HttpClientProps } from "@/modules/configuracoes/types";
import { Ref } from "vue";


export class ServiceRepository {
	private http = useAxios();
	#QUERY_KEY = 'consigner'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllServices(configParams?: HttpClientProps<ServiceModel[]>): Promise<ServiceModel[]> {
		try {
			const response = await this.http.get<{ data: any[], meta: any }>(`/servicos`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			console
			const values = response.data.map((e: Record<string, any>) => ServiceModel.fromRecord(this.getServiceByIdAdapter(e)));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getServiceById(dataId: number, configParams?: HttpClientProps<ServiceModel>): Promise<ServiceModel> {
		try {
			const response = await this.http.get<{ data: any }>(`/servicos/${dataId}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = ServiceModel.fromRecord(this.getServiceByIdAdapter(response.data))
			if (configParams?.metaCallback) { configParams?.metaCallback(response?.data?.meta, values) }
			return values
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	private getServiceByIdAdapter(data: Record<string, any>) {
		return {
			id: data.id,
			nome: data.nome,
			tema_do_icone: data.tema_do_icone,
			icone: data.icone,
			cor: data.cor
		}
	}


	async createService(
		body: ServiceModel,
		configParams?: HttpClientProps<ServiceModel>
	): Promise<void> {
		try {
			await this.http.post(`/servicos`, body.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updateService(
		data: ServiceModel,
		configParams?: HttpClientProps<ServiceModel>
	): Promise<void> {
		try {
			await this.http.put(`/servicos/${data.id}`, data.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async deleteService({ id }: Pick<ServiceModel, 'id'>,
		configParams?: HttpClientProps<ServiceModel>
	): Promise<void> {
		try {
			await this.http.delete(`/servicos/${id}`, {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}