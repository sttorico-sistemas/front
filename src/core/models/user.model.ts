import { BaseModel } from "src/core/models/base.model";

export class UserModel extends BaseModel {
	public id: number
	public name: string
	public operatorName: string
	public operatorId: number

	constructor(private props: {
		id: number;
		name: string;
		operatorName: string;
		operatorId: number
	}) {
		super();
		this.id = this.props.id;
		this.name = this.props.name;
		this.operatorName = this.props.operatorName;
		this.operatorId = this.props.operatorId;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.name,
			operador: this.operatorName,
			operador_id: this.operatorId,
		}
	}

	static fromRecord(record: Record<string, any>): UserModel {
		return new UserModel({
			id: record.id,
			name: record.name,
			operatorName: record.operador,
			operatorId: record.operador_id,
		});
	}
}