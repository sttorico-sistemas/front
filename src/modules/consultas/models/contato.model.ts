import { BaseModel } from "src/core/models/base.model";
import { Contato } from "../types/contato";

export class ContatoModel extends BaseModel implements Contato {
  public tipoContatoId: number;
  public telefone: string;
  public celular: string;
  public email: string;

  constructor(private props: {
    tipoContatoId: number;
    telefone: string;
    celular: string;
    email: string;
  }) {
    super();
    this.tipoContatoId = this.props.tipoContatoId;
    this.telefone = this.props.telefone;
    this.celular = this.props.celular;
    this.email = this.props.email;
  }

  toRecord(): Record<string, any> {
    return {
      tipo_contato_id: this.tipoContatoId,
      telefone: this.telefone,
      celular: this.celular,
      email: this.email,
    }
  }

  static fromRecord(record: Record<string, any>): ContatoModel {
    return new ContatoModel({
      tipoContatoId: record.tipo_contato_id,
      telefone: record.telefone,
      celular: record.celular,
      email: record.email ?? '',
    });
  }
}