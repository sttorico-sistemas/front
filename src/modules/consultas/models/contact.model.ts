import { BaseModel } from "src/core/models/base.model";
import { Contact } from "../types/contract";

export class ContactModel extends BaseModel implements Contact {
  public typeId: number;
  public phone: string;
  public cellPhone: string;
  public email: string;

  constructor(private props: {
    typeId: number;
    phone: string;
    cellPhone: string;
    email: string;
  }) {
    super();
    this.typeId = this.props.typeId;
    this.phone = this.props.phone;
    this.cellPhone = this.props.cellPhone;
    this.email = this.props.email;
  }

  toRecord(): Record<string, any> {
    return {
      tipo_contato_id: this.typeId,
      telefone: this.phone,
      celular: this.cellPhone,
      email: this.email,
    }
  }

  static fromRecord(record: Record<string, any>): ContactModel {
    return new ContactModel({
      typeId: record.tipo_contato_id,
      phone: record.telefone,
      cellPhone: record.celular,
      email: record.email ?? '',
    });
  }
}