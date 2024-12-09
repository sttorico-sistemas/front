import { useAxios } from "@/core/composables";
import { BaseError } from "@/core/errors/base.error";
import { MasterConsignerModel } from "@/core/models";
import { HttpClientProps } from "@/modules/configuracoes/types";
import { Ref } from "vue";

export class MasterConsignerRepository {
	private http = useAxios();
	#QUERY_KEY = 'master-consigner'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllMasterConsigners(configParams?: HttpClientProps<MasterConsignerModel[]>): Promise<MasterConsignerModel[]> {
		try {
			const response = await this.http.get<{ data: { data: any[], meta: any } }>(`/consignante-master`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.data.map((e: Record<string, any>) => MasterConsignerModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.data.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getMasterConsignerById(dataId: number, configParams?: HttpClientProps<MasterConsignerModel>): Promise<MasterConsignerModel> {
		try {
			const response = await this.http.get<{ data: any }>(`/consignante-master/${dataId}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			return MasterConsignerModel.fromRecord(response.data)
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async createMasterConsigner(
		body: MasterConsignerModel,
		configParams?: HttpClientProps<MasterConsignerModel>
	): Promise<void> {
		try {
			await this.http.post(`/consignante-master`, body.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updateMasterConsigner(
		data: MasterConsignerModel,
		configParams?: HttpClientProps<MasterConsignerModel>
	): Promise<void> {
		try {
			await this.http.put(`/consignante-master/${data.id}`, data.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}


	async deleteMasterConsigner({ id }: Pick<MasterConsignerModel, 'id'>,
		configParams?: HttpClientProps<MasterConsignerModel>
	): Promise<void> {
		try {
			return Promise.resolve()
			// await this.http.delete(`/consignante-master/${id}`, {
			// 	params: configParams?.params,
			// 	signal: configParams?.signal
			// });
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}