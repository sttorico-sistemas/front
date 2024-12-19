import { useAxios } from "@/core/composables";
import { BaseError } from "@/core/errors/base.error";
import { EndorserModel } from "@/core/models";
import { HttpClientProps } from "@/modules/configuracoes/types";
import { Ref } from "vue";


export class EndorserRepository {
	private http = useAxios();
	#QUERY_KEY = 'endorser'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllEndorsers(configParams?: HttpClientProps<EndorserModel[]>): Promise<EndorserModel[]> {
		try {
			return Promise.resolve([])
			// const response = await this.http.get<{ data: { data: any[], meta: any } }>(`/consignante`, {
			// 	params: configParams?.params,
			// 	signal: configParams?.signal
			// })
			// console.log(response)
			// const values = response.data.data.map((e: Record<string, any>) => EndorserModel.fromRecord(e));
			// if (configParams?.metaCallback) { configParams?.metaCallback(response.data.meta, values) }
			// return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getEndorserById(dataId: number, configParams?: HttpClientProps<EndorserModel>): Promise<EndorserModel> {
		try {
			return Promise.resolve({} as EndorserModel)
			// const response = await this.http.get<{ data: any }>(`/consignante/${dataId}`, {
			// 	params: configParams?.params,
			// 	signal: configParams?.signal
			// })
			// const values = EndorserModel.fromRecord(this.getEndorserByIdAdapter(response.data))
			// if (configParams?.metaCallback) { configParams?.metaCallback(response?.data?.meta, values) }
			// return values
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async createEndorser(
		body: EndorserModel,
		configParams?: HttpClientProps<EndorserModel>
	): Promise<void> {
		// try {
		// 	await this.http.post(`/consignante`, body.toRecord(), {
		// 		params: configParams?.params,
		// 		signal: configParams?.signal
		// 	});
		// } catch (error) {
		// 	throw BaseError.fromHttpError(error);
		// }
	}

	async updateEndorser(
		data: EndorserModel,
		configParams?: HttpClientProps<EndorserModel>
	): Promise<void> {
		// try {
		// 	await this.http.put(`/consignante/${data.id}`, data.toRecord(), {
		// 		params: configParams?.params,
		// 		signal: configParams?.signal
		// 	});
		// } catch (error) {
		// 	throw BaseError.fromHttpError(error);
		// }
	}

	async activateEndorser({ id }: Pick<EndorserModel, 'id'>,
		configParams?: HttpClientProps<EndorserModel>
	): Promise<void> {
		// try {
		// 	await this.http.patch(`/consignante/${id}/status`, {
		// 		params: configParams?.params,
		// 		signal: configParams?.signal
		// 	});
		// } catch (error) {
		// 	throw BaseError.fromHttpError(error);
		// }
	}
}