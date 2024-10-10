import { useAxios } from "src/core/composables/use_axios";
import { ConsignanteMaster } from "../types/consignante_master";
import { ConsignanteMasterModel } from "../models/consignante_master.model";
import { BaseError } from "src/core/errors/base.error";

export class ConsignanteMasterRepository {
  private http = useAxios();

  async getAllConsignantesMaster(): Promise<ConsignanteMaster[]> {
    try {
      const response = await this.http.get('/consignataria-master');
      return (response.data as Record<string, any>[]).map(
        (e) => ConsignanteMasterModel.fromRecord(e)
      );
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
      await this.http.post('/consignataria-master', data);
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }
}