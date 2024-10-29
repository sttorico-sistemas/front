import { BaseModel } from "src/core/models/base.model";
import { Cidade } from "../types/cidade.d";

export class CidadeModel extends BaseModel implements Cidade {
  public id: number;
  public nome: string;
  public estadoId: number;
  public ibgeId: number;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt?: Date;

  constructor(private props: {
    id: number;
    nome: string;
    estadoId: number;
    ibgeId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }) {
    super();
    this.id = this.props.id;
    this.nome = this.props.nome;
    this.estadoId = this.props.estadoId;
    this.ibgeId = this.props.ibgeId;
    this.createdAt = this.props.createdAt;
    this.updatedAt = this.props.updatedAt;
    this.deletedAt = this.props.deletedAt;
  }

  toRecord(): Record<string, any> {
    return {
      id: this.id,
      nome: this.nome,
      estado_id: this.estadoId,
      ibge_id: this.ibgeId,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    }
  }

  static fromRecord(record: Record<string, any>): CidadeModel {
    return new CidadeModel({
      id: record.id,
      nome: record.nome,
      estadoId: record.estado_id,
      ibgeId: record.ibge_id,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      deletedAt: record.deleted_at ? new Date(record.deleted_at) : undefined,
    });
  }
}