import { useAxios } from "@/core/composables";
import { BaseError } from "@/core/errors/base.error";
import { OperatorModel } from "@/core/models";
import { HttpClientProps } from "@/modules/configuracoes/types";
import { Ref } from "vue";


export class OperatorRepository {
	private http = useAxios();
	#QUERY_KEY = 'operator'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllOperators(configParams?: HttpClientProps<OperatorModel[]>): Promise<OperatorModel[]> {
		try {
			const response = await this.http.get<{ data: any[] }>(`/profile/operador`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.map((e: Record<string, any>) => OperatorModel.fromRecord(e));
			console.log(values)
			// if (configParams?.metaCallback) { configParams?.metaCallback(response.data.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getOperatorById(dataId: number, configParams?: HttpClientProps<OperatorModel>): Promise<OperatorModel> {
		try {
			const response = await this.http.get<{ data: any }>(`/profile/operador/${dataId}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			return OperatorModel.fromRecord(response.data)
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async createOperator(
		body: OperatorModel,
		configParams?: HttpClientProps<OperatorModel>
	): Promise<void> {
		try {
			await this.http.post(`/profile/operador`, body.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updateOperator(
		data: OperatorModel,
		configParams?: HttpClientProps<OperatorModel>
	): Promise<void> {
		try {
			await this.http.put(`/profile/operador/${data.id}`, data.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}


	async deleteOperator({ id }: Pick<OperatorModel, 'id'>,
		configParams?: HttpClientProps<OperatorModel>
	): Promise<void> {
		try {
			return Promise.resolve()
			// await this.http.delete(`/pessoas/${id}`, {
			// 	params: configParams?.params,
			// 	signal: configParams?.signal
			// });
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}