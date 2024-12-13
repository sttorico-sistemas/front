import { useAxios } from "src/core/composables/use_axios";
import { BaseError } from "src/core/errors/base.error";
import { HttpClientProps } from "@/modules/configuracoes/types/http-client";
import { Ref } from "vue";
import { PermissionTreeModel, ProfileModel } from "@/core/models";
import { PermissionModel } from "@/core/models/permission.model";

export class IAMRepository {
	private http = useAxios();
	#QUERY_KEY = 'profile'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async createTypeOfOperator(
		body: ProfileModel,
		configParams?: HttpClientProps<ProfileModel>
	): Promise<void> {
		try {
			await this.http.post(`/profile/tipo-operador`, body.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updateTypeOfOperator(
		data: ProfileModel,
		configParams?: HttpClientProps<ProfileModel>
	): Promise<void> {
		try {
			await this.http.put(`/profile/tipo-operador/${data.id}`, data.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async deleteTypeOfOperator(
		{ id }: Pick<ProfileModel, 'id'>,
		configParams?: HttpClientProps<ProfileModel>
	): Promise<void> {
		try {
			await this.http.delete(`/profile/tipo-operador/${id}`, {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getTypeOfOperators(configParams?: HttpClientProps<ProfileModel[]>): Promise<ProfileModel[]> {
		try {
			const response = await this.http.get<{ data: any[], meta: any }>(`/profile/tipo-operador`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.map((e: Record<string, any>) => ProfileModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.meta, values) }
			return values;

		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getTypeOfOperatorById(dataId: number, configParams?: HttpClientProps<ProfileModel>): Promise<ProfileModel> {
		try {
			const response = await this.http.get<{ data: any[] }>(`/profile/tipo-operador/${dataId}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			return ProfileModel.fromRecord(response.data)
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getPermissions(configParams?: HttpClientProps<PermissionModel[]>): Promise<PermissionModel[]> {
		try {
			const response = await this.http.get<any[]>(`/profile/permissions`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			return response.map((e: Record<string, any>) => PermissionModel.fromRecord(e));
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getTreePermissions(configParams?: HttpClientProps<PermissionTreeModel[]>): Promise<PermissionTreeModel[]> {
		try {
			const response = await this.http.get<any[]>(`/profile/paginas-componentes`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			return response.map((e: Record<string, any>) => PermissionTreeModel.fromRecord(e));
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}
