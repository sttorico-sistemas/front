import { useAxios } from "@/core/composables";
import { BaseError } from "@/core/errors/base.error";
import { FileModel } from "@/core/models";
import { HttpClientProps } from "@/modules/configuracoes/types";
import { Ref } from "vue";


export class FileRepository {
	private http = useAxios();
	#QUERY_KEY = 'file'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async getAllFiles(configParams?: HttpClientProps<FileModel[]>): Promise<FileModel[]> {
		try {
			const response = await this.http.get<{ data: { data: any[], meta: any } }>(`/files`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.data.map((e: Record<string, any>) => FileModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.data.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getFileById(dataId: number, configParams?: HttpClientProps<FileModel>): Promise<FileModel> {
		try {
			const response = await this.http.get<{ data: any }>(`/files/${dataId}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			return FileModel.fromRecord(response.data)
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async createFile(
		body: FileModel,
		configParams?: HttpClientProps<FileModel>
	): Promise<void> {
		try {
			await this.http.post(`/files`, body.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updateFile(
		data: FileModel,
		configParams?: HttpClientProps<FileModel>
	): Promise<void> {
		try {
			await this.http.put(`/files/${data.id}`, data.toRecord(), {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}


	async activateFile({ id }: Pick<FileModel, 'id'>,
		configParams?: HttpClientProps<FileModel>
	): Promise<void> {
		try {
			await this.http.patch(`/files/${id}/status`, {
				params: configParams?.params,
				signal: configParams?.signal
			});
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}