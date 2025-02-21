import { BaseModel } from "src/core/models/base.model";

export class FileModel extends BaseModel {
	public id: number
	public name: string
	public path: string
	public createdAt: number
	public updatedAt: number

	constructor(private props: {
		id: number;
		name: string;
		path: string;
		createdAt: number
		updatedAt: number
	}) {
		super();
		this.id = this.props.id;
		this.name = this.props.name;
		this.path = this.props.path;
		this.createdAt = this.props.createdAt;
		this.updatedAt = this.props.updatedAt;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.name,
		}
	}

	static fromRecord(record: Record<string, any>): FileModel {
		return new FileModel({
			id: record.id,
			name: record.name,
			path: record.path,
			createdAt: record.operador,
			updatedAt: record.operador_id,
		});
	}
}