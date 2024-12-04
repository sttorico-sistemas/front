import { BaseModel } from "src/core/models/base.model";

export class MasterConsignerModel extends BaseModel {
	public id?: number
	public name: string

	constructor(props: {
		id?: number;
		name: string;
	}) {
		super();
		this.id = props.id;
		this.name = props.name;
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
		});
	}
}