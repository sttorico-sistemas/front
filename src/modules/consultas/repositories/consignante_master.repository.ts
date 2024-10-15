import { useAxios } from "src/core/composables/use_axios";
import { ConsignanteMaster } from "../types/consignante_master";
import { ConsignanteMasterModel } from "../models/consignante_master.model";
import { BaseError } from "src/core/errors/base.error";
import { PaginatedResultOutput, PaginationArgs } from "src/core/types/pagination.type.d";

export class ConsignanteMasterRepository {
  private http = useAxios();

  async getAllConsignantesMaster(pagination?: PaginationArgs, query?: string): Promise<PaginatedResultOutput<ConsignanteMaster>> {
    try {
      const response = await this.http.get('/consignante-master', {
        params: {
          'per_page': pagination?.limit ?? 10,
          'page': pagination?.page ?? 1,
          'search': query,
        }
      });
      return {
        total: response.data.data.meta.total,
        items: (response.data.data.data as []).map(
          (e) => ConsignanteMasterModel.fromRecord(e),
        ),
      }
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }

  async updateConsignanteMaster(consignanteMaster: ConsignanteMaster): Promise<void> {
    try {
      await this.http.put(`/consignante-master/${consignanteMaster.id}`, {
        nome: consignanteMaster.nome,
      })
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }

  /**
   * TODO Analisar o conteúdo da resposta e 
   * ajustar o retorno do método. Se a 
   * resposta vazia, menter o retorno do tipo void.
   */
  async createConsignanteMaster(data: {
    name: string;
  }): Promise<void> {
    try {
      await this.http.post('/consignante-master', {
        nome: data.name,
      });
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }
}