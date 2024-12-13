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
			const response = await this.http.get<{ data: { data: any[], meta: any } }>(`/consignante`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			console.log(response)
			const values = response.data.data.map((e: Record<string, any>) => ConsignerModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.data.meta, values) }
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
			return ConsignerModel.fromRecord(this.getConsignerByIdAdapter(response.data))
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	private getConsignerByIdAdapter(data: Record<string, any>) {
		return {
			id: data.id,
			nome: data.nome,
			nome_curto: data.nome_curto,
			cnpj: data.cnpj,
			tipo_entidade_id: data.instituicao.id,
			consignante_master_id: data.master.id,
			endereco: {
				id: data?.endereco?.id,
				cidade_id: data?.cidade?.id,
				cidade_nome: data?.cidade?.nome,
				estado_id: data?.estado?.id,
				logradouro: data?.endereco?.logradouro,
				cep: data?.endereco?.cep,
			}
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

	async activateConsigner({ id }: Pick<ConsignerModel, 'id'>,
		configParams?: HttpClientProps<ConsignerModel>
	): Promise<void> {
		try {
			await this.http.patch(`/consignante/${id}/status`, {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}