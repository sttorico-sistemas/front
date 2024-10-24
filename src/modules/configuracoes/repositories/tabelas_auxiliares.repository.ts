import { useAxios } from "src/core/composables/use_axios";
import { Table } from "../types/table.d";
import { TableValue } from "../types/table_value.d";
import { BaseError } from "src/core/errors/base.error";
import { TableModel } from "../models/table.model";
import { TableValueModel } from "../models/table_value.model";

export class TabelasAuxiliaresRepository {
  private http = useAxios();

  async createTableValue(tableValue: TableValue): Promise<TableValue> {
    try {
      const response = await this.http.post(`/${tableValue.tableUrl}`, {
        nome: tableValue.nome,
      });
      return TableValueModel.fromRecord(response.data.data);
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }

  async deleteTableValue(tableUrl: string, valueId: number): Promise<void> {
    try {
      await this.http.delete(`/${tableUrl}/${valueId}`);
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }

  async updateTableValue(tableValue: TableValue): Promise<TableValue | null> {
    try {
      await this.http.put(`/${tableValue.tableUrl}/${tableValue.id}`, {
        nome: tableValue.nome,
      });
      return null;
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }

  async getAllTableValues(tableUrl: string): Promise<TableValue[]> {
    try {
      const response = await this.http.get(`/${tableUrl}`)
      const values = response.data.data.map((e: Record<string, any>) => TableValueModel.fromRecord(e));
      return values;
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }

  async getAllTables(): Promise<Table[]> {
    try {
      const response = await this.http.get('/auxiliar');
      const tables = response.data.data.map((e: Record<string, any>) => TableModel.fromRecord(e));
      return tables;
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }
}
