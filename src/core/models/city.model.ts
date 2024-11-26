import { BaseModel } from "src/core/models/base.model";

export class CityModel extends BaseModel {
  public id: number;
  public name: string;
  public stateId: number;
	public ibgeId: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(private props: {
    id: number;
    name: string;
    stateId: number;
		ibgeId: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super();
    this.id = this.props.id;
    this.name = this.props.name;
    this.stateId = this.props.stateId;
		this.ibgeId = this.props.ibgeId;
    this.createdAt = this.props.createdAt;
    this.updatedAt = this.props.updatedAt;
  }

  toRecord(): Record<string, any> {
    return {
      id: this.id,
      nome: this.name,
      ibge_id: this.ibgeId,
      estado_id: this.stateId,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  static fromRecord(record: Record<string, any>): CityModel {
    return new CityModel({
      id: record.id,
      name: record.nome,
      ibgeId: record.ibge_id,
      stateId: record.estado_id,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    });
  }
}