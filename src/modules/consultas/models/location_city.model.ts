import { BaseModel } from "src/core/models/base.model";
import { LocationCity } from "../types/location_city.d";

export class LocationCityModel extends BaseModel implements LocationCity {
  public id: number;
  public name: string;
  public stateId: number;
  public ibgeId: number;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt?: Date;

  constructor(private props: {
    id: number;
    name: string;
    stateId: number;
    ibgeId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }) {
    super();
    this.id = this.props.id;
    this.name = this.props.name;
    this.stateId = this.props.stateId;
    this.ibgeId = this.props.ibgeId;
    this.createdAt = this.props.createdAt;
    this.updatedAt = this.props.updatedAt;
    this.deletedAt = this.props.deletedAt;
  }

  toRecord(): Record<string, any> {
    return {
      id: this.id,
      nome: this.name,
      estado_id: this.stateId,
      ibge_id: this.ibgeId,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    }
  }

  static fromRecord(record: Record<string, any>): LocationCityModel {
    return new LocationCityModel({
      id: record.id,
      name: record.nome,
      stateId: record.estado_id,
      ibgeId: record.ibge_id,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      deletedAt: record.deleted_at ? new Date(record.deleted_at) : undefined,
    });
  }
}