import { BaseModel } from "src/core/models/base.model";


export class AuxiliaryBaseModel extends BaseModel {
	public id?: number;
	public name: string;
	public tableName: string;
	public childrenUrl: string;

	constructor(props: {
		id?: string;
		name: string;
		tableName: string,
		childrenUrl: string;
	}) {
		super();
		this.id = props?.id ? +props.id : undefined;
		this.name = props.name;
		this.tableName = props.tableName;
		this.childrenUrl = props?.childrenUrl;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.name,
			tabela: this.tableName,
			url: this.childrenUrl,
		}
	}

	static fromRecord(record: Record<string, any>): AuxiliaryBaseModel {
		return new AuxiliaryBaseModel({
			id: record.id,
			name: record.nome,
			tableName: record.tabela,
			childrenUrl: record.url,
		});
	}
}