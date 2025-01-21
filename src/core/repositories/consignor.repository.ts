import { useAxios } from "@/core/composables";
import { BaseError } from "@/core/errors/base.error";
import { ConsignorModel } from "@/core/models";
import { HttpClientProps } from "@/modules/configuracoes/types";
import { Ref } from "vue";


export class ConsignorRepository {
	private http = useAxios();
	#QUERY_KEY = 'consigner'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllConsignors(configParams?: HttpClientProps<ConsignorModel[]>): Promise<ConsignorModel[]> {
		try {
			const response = await this.http.get<{ data: { data: any[], meta: any } }>(`/consignante`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.data.map((e: Record<string, any>) => ConsignorModel.fromRecord(this.getConsignorByIdAdapter(e)));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.data.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getConsignorById(dataId: number, configParams?: HttpClientProps<ConsignorModel>): Promise<ConsignorModel> {
		try {
			const response = await this.http.get<{ data: any }>(`/consignante/${dataId}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = ConsignorModel.fromRecord(this.getConsignorByIdAdapter(response.data))
			if (configParams?.metaCallback) { configParams?.metaCallback(response?.data?.meta, values) }
			return values
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	private getConsignorByIdAdapter(data: Record<string, any>) {
		return {
			id: data.id,
			nome: data.nome,
			nome_curto: data.nome_curto,
			inicio: data.inicio,
			fim: data.fim,
			status: data.status,
			cnpj: data.cnpj,
			tipo_entidade_id: data.instituicao.id,
			tipo_entidade_nome: data.instituicao.nome,
			consignante_master_id: data.master.id,
			consignante_master_nome: data.master.nome,
			endereco: {
				id: data?.endereco?.id,
				cidade_id: data?.cidade?.id,
				cidade_nome: data?.cidade?.nome,
				estado_id: data?.estado?.id,
				estado_nome: data?.estado?.nome,
				logradouro: data?.endereco?.logradouro,
				cep: data?.endereco?.cep,
				tipo_endereco_id: data?.endereco?.tipo_endereco_id,
				tipo_endereco_nome: data?.endereco?.tipo_endereco,
			}
		}
	}


	async createConsignor(
		body: ConsignorModel,
		configParams?: HttpClientProps<ConsignorModel>
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

	async updateConsignor(
		data: ConsignorModel,
		configParams?: HttpClientProps<ConsignorModel>
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

	async activateConsignor({ id }: Pick<ConsignorModel, 'id'>,
		configParams?: HttpClientProps<ConsignorModel>
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