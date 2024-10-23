import { BaseModel } from "src/core/models/base.model";
import { LocationState } from "../types/location_state.d";

export class LocationStateModel extends BaseModel implements LocationState {
  public id: number;
  public name: string;
  public uf: string;
  public createdAt: string;
  public updatedAt: string;
  public deletedAt: string;
  public ibgeId: number;

  constructor(private props: {
    id: number;
    name: string;
    uf: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    ibgeId: number;
  }) {
    super();
    this.id = this.props.id;
    this.name = this.props.name;
    this.uf = this.props.uf;
    this.createdAt = this.props.createdAt;
    this.updatedAt = this.props.updatedAt;
    this.deletedAt = this.props.deletedAt;
    this.ibgeId = this.props.ibgeId;
  }

  static fromRecord(record: Record<string, any>): LocationState {
    return new LocationStateModel({
      id: record.id,
      name: record.nome,
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
      nome: this.name,
      uf: this.uf,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
      ibge_id: this.ibgeId,
    }
  }
}