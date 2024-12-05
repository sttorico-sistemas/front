import { BaseModel } from "src/core/models/base.model";


export class AuxiliaryModel extends BaseModel {
	public id?: number;
	public name: string;
	public basePath?: string;

	constructor(props: {
		id?: string;
		name: string;
		basePath?: string;
	}) {
		super();
		this.id = props?.id ? +props.id : undefined;
		this.name = props.name;
		this.basePath = props?.basePath;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			name: this.name,
		}
	}

	static fromRecord(record: Record<string, any>): AuxiliaryModel {
		return new AuxiliaryModel({
			id: record.id,
			name: record.nome,
		});
	}
}