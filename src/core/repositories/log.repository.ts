import { useAxios } from "@/core/composables";
import { BaseError } from "@/core/errors/base.error";
import { LogModel } from "@/core/models";
import { HttpClientProps } from "@/modules/configuracoes/types";
import { Ref } from "vue";


export class LogRepository {
	private http = useAxios();
	#QUERY_KEY = 'log'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllLogs(configParams?: HttpClientProps<LogModel[]>): Promise<LogModel[]> {
		try {
			return Promise.resolve([])
			// const response = await this.http.get<{ data: { data: any[], meta: any } }>(`/consignante`, {
			// 	params: configParams?.params,
			// 	signal: configParams?.signal
			// })
			// console.log(response)
			// const values = response.data.data.map((e: Record<string, any>) => LogModel.fromRecord(e));
			// if (configParams?.metaCallback) { configParams?.metaCallback(response.data.meta, values) }
			// return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getLogById(dataId: number, configParams?: HttpClientProps<LogModel>): Promise<LogModel> {
		try {
			return Promise.resolve({} as LogModel)
			// const response = await this.http.get<{ data: any }>(`/consignante/${dataId}`, {
			// 	params: configParams?.params,
			// 	signal: configParams?.signal
			// })
			// const values = LogModel.fromRecord(this.getLogByIdAdapter(response.data))
			// if (configParams?.metaCallback) { configParams?.metaCallback(response?.data?.meta, values) }
			// return values
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}