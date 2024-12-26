import { useAxios } from "@/core/composables";
import { BaseError } from "@/core/errors/base.error";
import { AnnotationModel } from "@/core/models";
import { HttpClientProps } from "@/modules/configuracoes/types";
import { Ref } from "vue";


export class AnnotationRepository {
	private http = useAxios();
	#QUERY_KEY = 'annotation'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllRegulations(configParams?: HttpClientProps<AnnotationModel[]>): Promise<AnnotationModel[]> {
		try {
			return Promise.resolve([])
			// const response = await this.http.get<{ data: { data: any[], meta: any } }>(`/consignante`, {
			// 	params: configParams?.params,
			// 	signal: configParams?.signal
			// })
			// console.log(response)
			// const values = response.data.data.map((e: Record<string, any>) => AnnotationModel.fromRecord(e));
			// if (configParams?.metaCallback) { configParams?.metaCallback(response.data.meta, values) }
			// return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getAnnotationById(dataId: number, configParams?: HttpClientProps<AnnotationModel>): Promise<AnnotationModel> {
		try {
			return Promise.resolve({} as AnnotationModel)
			// const response = await this.http.get<{ data: any }>(`/consignante/${dataId}`, {
			// 	params: configParams?.params,
			// 	signal: configParams?.signal
			// })
			// const values = AnnotationModel.fromRecord(this.getAnnotationByIdAdapter(response.data))
			// if (configParams?.metaCallback) { configParams?.metaCallback(response?.data?.meta, values) }
			// return values
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async createAnnotation(
		body: AnnotationModel,
		configParams?: HttpClientProps<AnnotationModel>
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

	async updateAnnotation(
		data: AnnotationModel,
		configParams?: HttpClientProps<AnnotationModel>
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

	async deleteAnnotation({ id }: Pick<AnnotationModel, 'id'>,
		configParams?: HttpClientProps<AnnotationModel>
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