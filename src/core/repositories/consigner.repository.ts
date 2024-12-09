import { useAxios } from "@/core/composables";
import { BaseError } from "@/core/errors/base.error";
import { ConsignerModel } from "@/core/models";
import { HttpClientProps } from "@/modules/configuracoes/types";
import { Ref } from "vue";


export class ConsignerRepository {
	private http = useAxios();
	#QUERY_KEY = 'consigner'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllConsigners(configParams?: HttpClientProps<ConsignerModel[]>): Promise<ConsignerModel[]> {
		try {
			const response = await this.http.get<{ data: any[] }>(`/consignante`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.map((e: Record<string, any>) => ConsignerModel.fromRecord(e));
			// if (configParams?.metaCallback) { configParams?.metaCallback(response.data.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getConsignerById(dataId: number, configParams?: HttpClientProps<ConsignerModel>): Promise<ConsignerModel> {
		try {
			const response = await this.http.get<{ data: any }>(`/consignante/${dataId}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			return ConsignerModel.fromRecord(response.data)
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async createConsigner(
		body: ConsignerModel,
		configParams?: HttpClientProps<ConsignerModel>
	): Promise<void> {
		try {
			await this.http.post(`/consignante`, body.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updateConsigner(
		data: ConsignerModel,
		configParams?: HttpClientProps<ConsignerModel>
	): Promise<void> {
		try {
			await this.http.put(`/consignante/${data.id}`, data.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}


	async deleteConsigner({ id }: Pick<ConsignerModel, 'id'>,
		configParams?: HttpClientProps<ConsignerModel>
	): Promise<void> {
		try {
			return Promise.resolve()
			// await this.http.delete(`/consignante/${id}`, {
			// 	params: configParams?.params,
			// 	signal: configParams?.signal
			// });
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}