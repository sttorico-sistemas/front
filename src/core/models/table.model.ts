import { Table, TableURL } from "@/modules/configuracoes/types";
import { BaseModel } from "src/core/models/base.model";


export class TableModel extends BaseModel implements Table {
  public id: number;
  public name: string;
  public url: TableURL;
  public deletedAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(private props: {
    id: number;
    name: string;
    url: string;
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super();
    this.id = this.props.id;
    this.name = this.props.name;
    this.url = this.props.url as TableURL;
    this.deletedAt = this.props.deletedAt;
    this.createdAt = this.props.createdAt;
    this.updatedAt = this.props.updatedAt;
  }

  toRecord(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      deleted_at: this.deletedAt,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    }
  }

  static fromRecord(record: Record<string, any>): TableModel {
    return new TableModel({
      id: record.id,
      name: record.nome,
      url: record.url,
      createdAt: new Date(record.created_at),
      deletedAt: new Date(record.deleted_at),
      updatedAt: new Date(record.updated_at),
    });
  }
}