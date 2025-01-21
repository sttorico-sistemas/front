import { useAxios } from "@/core/composables";
import { BaseError } from "@/core/errors/base.error";
import { RegulatoryModel } from "@/core/models";
import { HttpClientProps } from "@/modules/configuracoes/types";
import { Ref } from "vue";


export class RegulatoryRepository {
	private http = useAxios();
	#QUERY_KEY = 'regulatory'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllRegulations(configParams?: HttpClientProps<RegulatoryModel[]>): Promise<RegulatoryModel[]> {
		try {
			const response = await this.http.get<{ data: any[], meta: any }>(`/normativos`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.map((e: Record<string, any>) => RegulatoryModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getRegulatoryById(dataId: number, configParams?: HttpClientProps<RegulatoryModel>): Promise<RegulatoryModel> {
		try {
			const response = await this.http.get<{ data: any }>(`/normativos/${dataId}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = RegulatoryModel.fromRecord(response.data)
			if (configParams?.metaCallback) { configParams?.metaCallback(response?.data?.meta, values) }
			return values
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async createRegulatory(
		body: RegulatoryModel,
		configParams?: HttpClientProps<RegulatoryModel>
	): Promise<void> {
		try {
			await this.http.post(`/normativos`, body.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updateRegulatory(
		data: RegulatoryModel,
		configParams?: HttpClientProps<RegulatoryModel>
	): Promise<void> {
		try {
			await this.http.put(`/normativos/${data.id}`, data.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async activateRegulatory({ id }: Pick<RegulatoryModel, 'id'>,
		configParams?: HttpClientProps<RegulatoryModel>
	): Promise<void> {
		try {
			await this.http.patch(`/normativos/${id}/status`, {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}