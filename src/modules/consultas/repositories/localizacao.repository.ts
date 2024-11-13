import { useAxios } from "src/core/composables/use_axios";
import { BaseError } from "src/core/errors/base.error";
import { Estado } from "../types/estado";
import { EstadoModel } from "../models/estado.model";
import { CidadeModel } from "../models/cidade.model";
import { Cidade } from "../types/cidade";

export class LocalizacaoRepository {
  private http = useAxios();

  async getEstados(): Promise<Estado[]> {
    try {
      const response = await this.http.get('/estados');
      return (response.data.data as []).map(
        (e) => EstadoModel.fromRecord(e),
      );
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }

  async getEstadoCidades(stateId: number): Promise<Cidade[]> {
    try {
      const response = await this.http.get(`/estados/${stateId}/cidades`)
      return (response.data.data as []).map(
        (e) => CidadeModel.fromRecord(e),
      );
    } catch (error) {
      throw BaseError.fromHttpError(error);
    }
  }
}