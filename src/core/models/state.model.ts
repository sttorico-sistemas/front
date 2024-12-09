import { BaseModel } from "src/core/models/base.model";

export class StateModel extends BaseModel {
  public id: number;
  public name: string;
  public uf: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(private props: {
    id: number;
    name: string;
    uf: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super();
    this.id = this.props.id;
    this.name = this.props.name;
    this.uf = this.props.uf;
    this.createdAt = this.props.createdAt;
    this.updatedAt = this.props.updatedAt;
  }

  toRecord(): Record<string, any> {
    return {
      id: this.id,
      nome: this.name,
      uf: this.uf,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  static fromRecord(record: Record<string, any>): StateModel {
    return new StateModel({
      id: record.id,
      name: record.nome,
      uf: record.uf,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    });
  }
}