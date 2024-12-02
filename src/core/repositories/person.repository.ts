import { useAxios } from "@/core/composables";
import { BaseError } from "@/core/errors/base.error";
import { PersonModel } from "@/core/models";
import { HttpClientProps } from "@/modules/configuracoes/types";
import { Ref } from "vue";


export class PersonRepository {
	private http = useAxios();
	#QUERY_KEY = 'general'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllPersons(configParams?: HttpClientProps<PersonModel[]>): Promise<PersonModel[]> {
		try {
			const response = await this.http.get<{ data: { data: any[], meta: any } }>(`/pessoas`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.data.map((e: Record<string, any>) => PersonModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.data.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getPersonById(dataId: number, configParams?: HttpClientProps<PersonModel>): Promise<PersonModel> {
		try {
			const response = await this.http.get<{ data: any }>(`/pessoas/${dataId}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			return PersonModel.fromRecord(response.data)
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async personCreate(
		body: PersonModel,
		configParams?: HttpClientProps<PersonModel>
	): Promise<void> {
		console.log('personCreate', body.toRecord())
		try {
			await this.http.post(`/pessoas`, body.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updateTableValue(
		data: PersonModel,
		configParams?: HttpClientProps<PersonModel>
	): Promise<void> {
		try {
			await this.http.put(`/pessoas/${data.id}`, data.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}


	async deletePerson({ id }: Pick<PersonModel, 'id'>,
		configParams?: HttpClientProps<PersonModel>
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