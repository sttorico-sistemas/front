import { BaseModel } from "src/core/models/base.model";

export class CityModel extends BaseModel {
	public id: number;
	public name: string;
	public stateId: number;
	public stateName: string;
	public createdAt?: Date;
	public updatedAt?: Date;

	constructor(private props: {
		id: number;
		name: string;
		stateId: number;
		stateName: string;
		createdAt?: Date;
		updatedAt?: Date;
	}) {
		super();
		this.id = this.props.id;
		this.name = this.props.name;
		this.stateId = this.props.stateId;
		this.stateName = this.props.stateName;
		this.createdAt = this.props.createdAt;
		this.updatedAt = this.props.updatedAt;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.name,
			estado_id: this.stateId,
			created_at: this.createdAt,
			updated_at: this.updatedAt,
		};
	}

	static fromRecord(record: Record<string, any>): CityModel {
		return new CityModel({
			id: record.id,
			name: record.nome,
			stateName: record.estado.nome,
			stateId: record.estado_id,
			createdAt: new Date(record.created_at),
			updatedAt: new Date(record.updated_at),
		});
	}
}