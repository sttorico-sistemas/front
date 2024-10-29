import { BaseModel } from "src/core/models/base.model";
import { Endereco } from "../types/endereco";

export class EnderecoModel extends BaseModel implements Endereco {
  public tipoEnderecoId: number;
  public endereco: string;
  public cidadeId: number;

  constructor(private props: {
    tipoEnderecoId: number;
    endereco: string;
    cidadeId: number;
  }) {
    super();
    this.tipoEnderecoId = this.props.tipoEnderecoId;
    this.endereco = this.props.endereco;
    this.cidadeId = this.props.cidadeId;
  }

  toRecord(): Record<string, any> {
    return {
      tipo_endereco_id: this.tipoEnderecoId,
      endereco: this.endereco,
      cidade_id: this.cidadeId,
    }
  }

  static fromRecord(record: Record<string, any>): EnderecoModel {
    return new EnderecoModel({
      tipoEnderecoId: record.tipo_endereco_id,
      endereco: record.endereco,
      cidadeId: record.cidade_id,
    });
  }
}