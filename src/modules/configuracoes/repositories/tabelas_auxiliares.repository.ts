import { useAxios } from "src/core/composables/use_axios";
import { Table } from "../types/table.d";
import { TableValue } from "../types";
import { BaseError } from "src/core/errors/base.error";
import { TableModel } from "../models/table.model";
import { TableValueModel } from "../models/table_value.model";
import { ResponseApiPagination } from "@/modules/configuracoes/types";
import { HttpClientProps } from "@/modules/configuracoes/types/http-client";
import { Ref } from "vue";

export class TabelasAuxiliaresRepository {
	private http = useAxios();
	private basePath = 'auxiliar'
	#QUERY_KEY = 'auxiliary'

	getQueryKey(tag?: string | Ref<string>, pagination?: { page?: Ref<number>, limit?: Ref<number> }, ...others: Ref<unknown>[]) {
		if (pagination === undefined) {
			return [tag ?? this.#QUERY_KEY]
		}
		return [tag ?? this.#QUERY_KEY, pagination, ...others]
	}

	async createTableValue<T extends Record<string, unknown>>({ tableUrl, ...body }: Pick<TableValue & T, 'nome' | 'tableUrl'>, configParams?: HttpClientProps<TableValue>): Promise<TableValue> {
		console.log('createTableValue', { tableUrl, ...body })
		if (!tableUrl) { return {} as TableValue }
		try {
			const response = await this.http.post<any, any>(
				`/${tableUrl.startsWith('auxiliary') ? tableUrl.replace('_', '-') : 'auxiliary/' + tableUrl.replace('_', '-')}`,
				body
				, configParams);
			return TableValueModel.fromRecord(response.data);
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async deleteTableValue(tableUrl: string, valueId: number): Promise<void> {
		if (!tableUrl || !valueId) { return }

		try {
			await this.http.delete(`/${tableUrl.startsWith('auxiliary') ? tableUrl.replace('_', '-') : 'auxiliary/' + tableUrl.replace('_', '-')}/${valueId}`);
			return
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updateTableValue(tableValue: TableValue): Promise<TableValue | null> {
		if (!tableValue?.tableUrl || !tableValue?.id) { return null }
		try {
			await this.http.put(`/${tableValue.tableUrl.startsWith('auxiliary') ? tableValue.tableUrl.replace('_', '-') : 'auxiliary/' + tableValue.tableUrl.replace('_', '-')}/${tableValue.id}`, {
				nome: tableValue.nome,
			});
			return null;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getAllTableValues<T extends TableValue>(tableUrl?: string, configParams?: HttpClientProps<T[]>): Promise<T[]> {
		if (!tableUrl) return []
		try {
			// TODO: Verificar isso com o backend
			const response = await this.http.get<any>(`/${tableUrl.startsWith('auxiliary') ? tableUrl.replace('_', '-') : 'auxiliary/' + tableUrl.replace('_', '-')}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.map((e: Record<string, any>) => TableValueModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.meta, values) }
			return values;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getAllTables(configParams?: HttpClientProps<Table[]>): Promise<Table[]> {
		try {
			const response = await this.http.get<ResponseApiPagination<Record<string, any>[]>>(`/${this.basePath}`, {
				params: configParams?.params,
				signal: configParams?.signal
			});
			const tables = response.data.map((e: Record<string, any>) => TableModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.meta, tables) }
			return tables;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}
