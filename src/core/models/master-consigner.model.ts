import { Status } from "@/core/types";
import { BaseModel } from "src/core/models/base.model";

export class MasterConsignerModel extends BaseModel {
	public id?: number
	public name: string
	public status?: Status

	constructor(props: {
		id?: number;
		name: string;
		status?: Status
	}) {
		super();
		this.id = props.id;
		this.name = props.name;
		this.status = props.status;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.name,
		}
	}

	static fromRecord(record: Record<string, any>): MasterConsignerModel {
		return new MasterConsignerModel({
			id: record.id,
			name: record.nome,
			status: record.status
		});
	}

	public equals(entity: MasterConsignerModel) {
		if (entity === this) {
			return true
		}

		if (entity.id === this.id && JSON.stringify(entity) === JSON.stringify(this)) {
			return true
		}

		return false
	}
}