import { BaseModel } from "src/core/models/base.model";
import { Estado, EstadoUf } from "../types/estado";

export class EstadoModel extends BaseModel implements Estado {
  public id: number;
  public nome: string;
  public uf: EstadoUf;
  public createdAt: string;
  public updatedAt: string;
  public deletedAt: string;
  public ibgeId: number;

  constructor(private props: {
    id: number;
    nome: string;
    uf: EstadoUf;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    ibgeId: number;
  }) {
    super();
    this.id = this.props.id;
    this.nome = this.props.nome;
    this.uf = this.props.uf;
    this.createdAt = this.props.createdAt;
    this.updatedAt = this.props.updatedAt;
    this.deletedAt = this.props.deletedAt;
    this.ibgeId = this.props.ibgeId;
  }

  static fromRecord(record: Record<string, any>): EstadoModel {
    return new EstadoModel({
      id: record.id,
      nome: record.nome,
      uf: record.uf,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      deletedAt: record.deleted_at,
      ibgeId: record.ibge_id,
    });
  }

  toRecord(): Record<string, any> {
    return {
      id: this.id,
      nome: this.nome,
      uf: this.uf,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
      ibge_id: this.ibgeId,
    }
  }
}