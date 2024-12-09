import { BaseModel } from "src/core/models/base.model";

export class CityModel extends BaseModel {
	public id?: number;
	public name: string;
	public stateId: number;
	public ibgeId: number;
	public stateName?: string;
	public basePath?: string;
	public createdAt?: Date;
	public updatedAt?: Date;

	constructor(props: {
		id?: string;
		name: string;
		stateId: number;
		stateName?: string;
		ibgeId: number,
		basePath?: string;
		createdAt?: Date;
		updatedAt?: Date;
	}) {
		super();
		this.id = props?.id ? +props.id : undefined;
		this.name = props.name;
		this.stateId = props.stateId;
		this.stateName = props?.stateName;
		this.ibgeId = props.ibgeId;
		this.basePath = props.basePath;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
	}

	toRecord(): Record<string, any> {
		return {
			id: this?.id,
			nome: this.name,
			estado_id: this.stateId,
			ibge_id: this.ibgeId,
		};
	}

	static fromRecord(record: Record<string, any>): CityModel {
		return new CityModel({
			id: record.id,
			name: record.nome,
			stateName: record.estado.nome,
			stateId: record.estado_id,
			ibgeId: record.ibge_id,
			createdAt: new Date(record.created_at),
			updatedAt: new Date(record.updated_at),
		});
	}
}