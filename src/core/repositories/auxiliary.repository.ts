import { Ref } from "vue";
import { AuxiliaryBaseModel, AuxiliaryModel, CityModel, StateModel } from "@/core/models";
import { useAxios } from "@/core/composables";
import { HttpClientProps } from "@/core/types";
import { BaseError } from "@/core/errors/base.error";

export class AuxiliaryRepository {
	private http = useAxios();
	#QUERY_KEY = 'auxiliary'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllAuxiliaryBases(configParams?: HttpClientProps<AuxiliaryBaseModel[]>): Promise<AuxiliaryBaseModel[]> {
		try {
			const response = await this.http.get<{ data: any[], meta: any }>('/auxiliar', {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.map((e: Record<string, any>) => AuxiliaryBaseModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response?.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getAllGenericAuxiliaries(auxiliaryPath: string, configParams?: HttpClientProps<AuxiliaryModel[]>): Promise<AuxiliaryModel[]> {
		try {
			const response = await this.http.get<{ data: any[], meta: any }>(auxiliaryPath, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.map((e: Record<string, any>) => AuxiliaryModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getGenericAuxiliaryById(dataId: number, auxiliaryPath: string, configParams?: HttpClientProps<AuxiliaryModel>): Promise<AuxiliaryModel> {
		try {
			const response = await this.http.get<{ data: any }>(`/${auxiliaryPath}/${dataId}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			return AuxiliaryModel.fromRecord(response.data)
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async createGenericAuxiliary(data: AuxiliaryModel, configParams?: HttpClientProps<AuxiliaryModel>): Promise<void> {
		if (!data?.basePath) throw new BaseError({ message: "Don't have basePath", errors: {} })
		try {
			await this.http.post<any, any>(data?.basePath, data.toRecord(), configParams);
			return
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updateGenericAuxiliary(data: AuxiliaryModel, configParams?: HttpClientProps<AuxiliaryModel>): Promise<void> {
		if (!data?.basePath) throw new BaseError({ message: "Don't have basePath", errors: {} })
		try {
			await this.http.put(`/${data?.basePath}/${data.id}`, data.toRecord(), configParams);
			return
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async deleteGenericAuxiliary({ id, basePath }: Pick<Required<AuxiliaryModel>, 'basePath' | 'id'>): Promise<void> {
		try {
			return Promise.resolve()
			// await this.http.delete(`/${basePath}/${id}`);
			return
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}


	async getAllStates(configParams?: HttpClientProps<StateModel[]>): Promise<StateModel[]> {
		try {
			const response = await this.http.get<{ data: any[], meta: any }>(`/auxiliary/estados`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.map((e: Record<string, any>) => StateModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getAllCities(configParams?: HttpClientProps<CityModel[]>): Promise<CityModel[]> {
		try {
			const response = await this.http.get<{ data: any[], meta: any }>(`/auxiliary/cidade`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.map((e: Record<string, any>) => CityModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getAllContactTypes(configParams?: HttpClientProps<AuxiliaryModel[]>): Promise<AuxiliaryModel[]> {
		try {
			const response = await this.http.get<{ data: any[], meta: any }>(`auxiliary/tipo-contato`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.map((e: Record<string, any>) => AuxiliaryModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getAllAddressTypes(configParams?: HttpClientProps<AuxiliaryModel[]>): Promise<AuxiliaryModel[]> {
		try {
			const response = await this.http.get<{ data: any[], meta: any }>(`auxiliary/tipo-endereco`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.map((e: Record<string, any>) => AuxiliaryModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getCityById(dataId: number, configParams?: HttpClientProps<CityModel>): Promise<CityModel> {
		try {
			const response = await this.http.get<any>(`/auxiliary/cidade/${dataId}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			return CityModel.fromRecord(response.data)
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}
