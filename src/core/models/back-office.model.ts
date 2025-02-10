import { BaseModel } from "src/core/models/base.model";

export class BackOfficeModel extends BaseModel {
	public id?: number;
	public name: string;
	public sectorId: string;
	public sectorName: string;
	public cityId: string;
	public cityName?: string;
	public ufId: string;
	public ufName?: string;
	public status?: number;

	constructor(props: {
		id?: number;
		name: string;
		sectorId: string;
		sectorName: string;
		cityId: string;
		cityName?: string;
		ufId: string;
		ufName?: string;
		status?: number;
	}) {
		super();
		this.id = props.id;
		this.name = props.name;
		this.cityId = props.cityId;
		this.cityName = props.cityName;
		this.ufId = props.ufId;
		this.ufName = props.ufName;
		this.sectorId = props.sectorId;
		this.sectorName = props.sectorName;
		this.status = props.status;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.name
		}
	}

	static fromRecord(record: Record<string, any>): BackOfficeModel {
		return new BackOfficeModel({
			id: record.id,
			name: record.nome,
			cityId: record.cidade_id,
			cityName: record.cidade_name,
			ufId: record.estado_id,
			ufName: record.estado_name,
			sectorId: record.setor_id,
			sectorName: record.setor_nome,
			status: record.status
		});
	}

	public equals(entity: BackOfficeModel) {
		if (entity === this) {
			return true
		}

		if (entity.id === this.id && JSON.stringify(entity) === JSON.stringify(this)) {
			return true
		}

		return false
	}
}