import { useAxios } from "@/core/composables";
import { BaseError } from "@/core/errors/base.error";
import { InstructionOfProcedureModel } from "@/core/models";
import { HttpClientProps } from "@/modules/configuracoes/types";
import { Ref } from "vue";


export class InstructionOfProcedureRepository {
	private http = useAxios();
	#QUERY_KEY = 'instruction-of-procedure'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllInstructionOfProcedures(configParams?: HttpClientProps<InstructionOfProcedureModel[]>): Promise<InstructionOfProcedureModel[]> {
		try {
			return Promise.resolve([])
			// const response = await this.http.get<{ data: { data: any[], meta: any } }>(`/consignante`, {
			// 	params: configParams?.params,
			// 	signal: configParams?.signal
			// })
			// console.log(response)
			// const values = response.data.data.map((e: Record<string, any>) => InstructionOfProcedureModel.fromRecord(e));
			// if (configParams?.metaCallback) { configParams?.metaCallback(response.data.meta, values) }
			// return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getInstructionOfProcedureById(dataId: number, configParams?: HttpClientProps<InstructionOfProcedureModel>): Promise<InstructionOfProcedureModel> {
		try {
			return Promise.resolve({} as InstructionOfProcedureModel)
			// const response = await this.http.get<{ data: any }>(`/consignante/${dataId}`, {
			// 	params: configParams?.params,
			// 	signal: configParams?.signal
			// })
			// const values = InstructionOfProcedureModel.fromRecord(this.getInstructionOfProcedureByIdAdapter(response.data))
			// if (configParams?.metaCallback) { configParams?.metaCallback(response?.data?.meta, values) }
			// return values
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async createInstructionOfProcedure(
		body: InstructionOfProcedureModel,
		configParams?: HttpClientProps<InstructionOfProcedureModel>
	): Promise<void> {
		// try {
		// 	await this.http.post(`/consignante`, body.toRecord(), {
		// 		params: configParams?.params,
		// 		signal: configParams?.signal
		// 	});
		// } catch (error) {
		// 	throw BaseError.fromHttpError(error);
		// }
	}

	async updateInstructionOfProcedure(
		data: InstructionOfProcedureModel,
		configParams?: HttpClientProps<InstructionOfProcedureModel>
	): Promise<void> {
		// try {
		// 	await this.http.put(`/consignante/${data.id}`, data.toRecord(), {
		// 		params: configParams?.params,
		// 		signal: configParams?.signal
		// 	});
		// } catch (error) {
		// 	throw BaseError.fromHttpError(error);
		// }
	}

	async activateInstructionOfProcedure({ id }: Pick<InstructionOfProcedureModel, 'id'>,
		configParams?: HttpClientProps<InstructionOfProcedureModel>
	): Promise<void> {
		// try {
		// 	await this.http.patch(`/consignante/${id}/status`, {
		// 		params: configParams?.params,
		// 		signal: configParams?.signal
		// 	});
		// } catch (error) {
		// 	throw BaseError.fromHttpError(error);
		// }
	}
}