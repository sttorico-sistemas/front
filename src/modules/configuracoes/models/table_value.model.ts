import { BaseModel } from "src/core/models/base.model";
import { TableValue } from "../types/table_value";

export class TableValueModel extends BaseModel implements TableValue {
  public id: number;
  public nome: string;
  public tableUrl?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  constructor(private props: {
    id: number;
    nome: string;
    tableUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    super();
    this.id = this.props.id;
    this.nome = this.props.nome;
    this.tableUrl = this.props.tableUrl;
    this.createdAt = this.props.createdAt;
    this.updatedAt = this.props.updatedAt;
    this.deletedAt = this.props.deletedAt;
  }

  toRecord(): Record<string, any> {
    return {
      id: this.id,
      nome: this.nome,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromRecord(record: Record<string, any>): TableValueModel {
    return new TableValueModel({
      id: record.id,
      nome: record.nome,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      deletedAt: new Date(record.deleted_at),
    });
  }
}