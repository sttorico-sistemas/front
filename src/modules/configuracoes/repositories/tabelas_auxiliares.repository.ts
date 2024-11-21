import { useAxios } from "src/core/composables/use_axios";
import { Table } from "../types/table.d";
import { TableValue } from "../types";
import { BaseError } from "src/core/errors/base.error";
import { TableModel } from "../models/table.model";
import { TableValueModel } from "../models/table_value.model";
import { ResponseApiPagination } from "@/modules/configuracoes/types";
import { HttpClientProps } from "@/modules/configuracoes/types/http-client";

export class TabelasAuxiliaresRepository {
	private http = useAxios();
	private basePath = 'auxiliar'
	#QUERY_KEY = 'auxiliary'

	getQueryKey(tag = this.#QUERY_KEY, pagination?: { page?: number, limit?: number }, ...others: string[]) {
		if (pagination === undefined) {
			return [tag]
		}
		return [tag, pagination, ...others]
	}

	async createTableValue(tableValue: Pick<TableValue, 'nome' | 'tableUrl'>, configParams?: HttpClientProps<TableValue>): Promise<TableValue> {
		if (!tableValue?.tableUrl) { return {} as TableValue }
		try {
			const response = await this.http.post(`/${tableValue.tableUrl.startsWith('auxiliary') ? tableValue.tableUrl.replace('_', '-') : 'auxiliary/' + tableValue.tableUrl.replace('_', '-')}`, {
				nome: tableValue.nome,
			}, configParams);
			return TableValueModel.fromRecord(response.data.data);
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
			const response = await this.http.get(`/${tableUrl.startsWith('auxiliary') ? tableUrl.replace('_', '-') : 'auxiliary/' + tableUrl.replace('_', '-')}`, {
				params: configParams?.params,
				signal: configParams?.signal
			})
			const values = response.data.data.map((e: Record<string, any>) => TableValueModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.data.meta, values) }
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
			const tables = response.data.data.map((e: Record<string, any>) => TableModel.fromRecord(e));
			if (configParams?.metaCallback) { configParams?.metaCallback(response.data.meta, tables) }
			return tables;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}
