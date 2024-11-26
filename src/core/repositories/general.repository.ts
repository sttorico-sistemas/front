import { useAxios } from "src/core/composables/use_axios";
import { BaseError } from "src/core/errors/base.error";
import { HttpClientProps } from "@/modules/configuracoes/types/http-client";
import { Ref } from "vue";
import { PageModel } from "@/core/models";
import { useStorage } from "@/core/composables";

export class GeneralRepository {
	private http = useAxios();
	#QUERY_KEY = 'general'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async createPage(body: Pick<PageModel, 'name' | 'slug' | 'url' | 'parentId'>, configParams?: HttpClientProps<PageModel>): Promise<void> {
		try {
			await this.http.post(`/organize/pages`, body, configParams);
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updateTableValue({ id, ...body }: Pick<PageModel, 'name' | 'slug' | 'url' | 'parentId' | 'id'>): Promise<void> {
		try {
			await this.http.put(`/organize/pages/${id}`, body);
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getPagesToMenu(configParams?: HttpClientProps<PageModel[]>): Promise<PageModel[]> {
		try {
			const response = await this.http.get<any[]>(`/menu/accessible`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			return response.map((e: Record<string, any>) => PageModel.fromRecord(e));
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getAllPages(configParams?: HttpClientProps<PageModel[]>): Promise<PageModel[]> {
		try {
			const response = await this.http.get<{ data: any[] }>(`/organize/pages`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			return response.data.map((e: Record<string, any>) => PageModel.fromRecord(e));
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getPageById(dataId: number, configParams?: HttpClientProps<PageModel>): Promise<PageModel> {
		try {
			const response = await this.http.get<{ data: any }>(`/organize/pages/${dataId}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			return PageModel.fromRecord(response.data)
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}
