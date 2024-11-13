import { BaseModel } from "src/core/models/base.model";
import { ConsignanteMaster } from "../types/consignante_master.d";

export class ConsignanteMasterModel extends BaseModel implements ConsignanteMaster {
  public id: number;
  public nome: string;
  public deletedAt?: Date | undefined;
  public createdAt?: Date | undefined;
  public updatedAt?: Date | undefined;

  constructor(private props: {
    id: number;
    nome: string;
    deletedAt?: Date | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
  }) {
    super();
    this.id = this.props.id;
    this.nome = this.props.nome;
    this.deletedAt = this.props.deletedAt;
    this.createdAt = this.props.createdAt;
    this.updatedAt = this.props.updatedAt;
  }

  static fromRecord(record: Record<string, any>): ConsignanteMasterModel {
    return new ConsignanteMasterModel({
      id: record.id,
      nome: record.nome,
      createdAt: record.created_at ? new Date(record.created_at) : undefined,
      deletedAt: record.deleted_at ? new Date(record.deleted_at) : undefined,
      updatedAt: record.updated_at ? new Date(record.updated_at) : undefined,
    });
  }

  toRecord(): Record<string, any> {
    return {
      id: this.id,
      nome: this.nome,
      created_at: this.createdAt?.toISOString(),
      deleted_at: this.deletedAt?.toISOString(),
      updated_at: this.updatedAt?.toISOString(),
    }
  }
}