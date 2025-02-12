import { useAxios } from "@/core/composables";
import { BaseError } from "@/core/errors/base.error";
import { ManagerModel } from "@/core/models";
import { HttpClientProps } from "@/modules/configuracoes/types";
import { Ref } from "vue";


export class ManagerRepository {
	private http = useAxios();
	#QUERY_KEY = 'manager'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllManagers(configParams?: HttpClientProps<ManagerModel[]>): Promise<ManagerModel[]> {
		try {
			const response = await this.http.get<{ data: any[], meta: any }>(`/gestores`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.map((e: Record<string, any>) => ManagerModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getManagerById(dataId: number, configParams?: HttpClientProps<ManagerModel>): Promise<ManagerModel> {
		try {
			const response = await this.http.get<{ data: any }>(`/gestores/${dataId}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			console.log(response.data)

			const values = ManagerModel.fromRecord(response.data)
			return values
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async createManager(
		body: ManagerModel,
		configParams?: HttpClientProps<ManagerModel>
	): Promise<void> {
		try {
			await this.http.post(`/gestores`, body.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updateManager(
		data: ManagerModel,
		configParams?: HttpClientProps<ManagerModel>
	): Promise<void> {
		try {
			await this.http.put(`/gestores/${data.id}`, data.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async activateManager({ id }: Pick<ManagerModel, 'id'>,
		configParams?: HttpClientProps<ManagerModel>
	): Promise<void> {
		try {
			await this.http.patch(`/gestores/${id}/status`, {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}