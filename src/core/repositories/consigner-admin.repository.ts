import { useAxios } from "@/core/composables";
import { BaseError } from "@/core/errors/base.error";
import { ConsignerAdminModel } from "@/core/models";
import { HttpClientProps } from "@/modules/configuracoes/types";
import { Ref } from "vue";


export class ConsignerAdminRepository {
	private http = useAxios();
	#QUERY_KEY = 'consigner-admin'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllConsignerAdmins(configParams?: HttpClientProps<ConsignerAdminModel[]>): Promise<ConsignerAdminModel[]> {
		try {
			const response = await this.http.get< { data: any[], meta: any }>(`/consignatarias`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.map((e: Record<string, any>) => ConsignerAdminModel.fromRecord(this.getConsignerAdminByIdAdapter(e)));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getConsignerAdminById(dataId: number, configParams?: HttpClientProps<ConsignerAdminModel>): Promise<ConsignerAdminModel> {
		try {
			const response = await this.http.get<{ data: any }>(`/consignatarias/${dataId}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = ConsignerAdminModel.fromRecord(this.getConsignerAdminByIdAdapter(response.data))
			if (configParams?.metaCallback) { configParams?.metaCallback(response?.data?.meta, values) }
			return values
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	private getConsignerAdminByIdAdapter(data: Record<string, any>) {
		return {
			id: data.id,
			nome: data.nome,
			nome_curto: data.nome_curto,
			status: data.status,
			cnpj: data.cnpj,
			tipo_entidade_id: data.tipo_entidade_id,
			tipo_entidade_nome: null,
			endereco: {
				cidade_id: data?.cidade?.id,
				cidade_nome: data?.cidade?.nome,
				estado_id: data?.estado?.id,
				estado_nome: data?.estado?.nome,
				logradouro: data?.logradouro,
				cep: data?.cep,
				// tipo_endereco_id: data?.endereco?.tipo_endereco_id,
				// tipo_endereco_nome: data?.endereco?.tipo_endereco,
			}
		}
	}


	async createConsignerAdmin(
		body: ConsignerAdminModel,
		configParams?: HttpClientProps<ConsignerAdminModel>
	): Promise<void> {
		try {
			await this.http.post(`/consignatarias`, body.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updateConsignerAdmin(
		data: ConsignerAdminModel,
		configParams?: HttpClientProps<ConsignerAdminModel>
	): Promise<void> {
		try {
			await this.http.put(`/consignatarias/${data.id}`, data.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async activateConsignerAdmin({ id }: Pick<ConsignerAdminModel, 'id'>,
		configParams?: HttpClientProps<ConsignerAdminModel>
	): Promise<void> {
		try {
			await this.http.patch(`/consignatarias/${id}/status`, {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}