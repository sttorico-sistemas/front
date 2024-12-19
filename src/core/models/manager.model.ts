import { BaseModel } from "src/core/models/base.model";

export class ManagerModel extends BaseModel {
	public id?: number
	public name: string
	public position: string
	public department: string
	public phone: string
	public cellphone: string;
	public email: string;
	public status?: number

	constructor(props: {
		id?: number
		name: string
		position: string
		department: string
		phone: string
		cellphone: string;
		email: string;
		status?: number
	}) {
		super();
		this.id = props.id;
		this.name = props.name;
		this.position = props.position;
		this.department = props.department;
		this.phone = props.phone;
		this.cellphone = props.cellphone;
		this.email = props.email;
		this.status = props.status;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.name,
		}
	}

	static fromRecord(record: Record<string, any>): ManagerModel {
		return new ManagerModel({
			id: record.id,
			name: record.nome,
			department: record.departamento,
			position: record.funcao,
			cellphone: record.celular,
			email: record?.email,
			phone: record.telefone,
			status: record.status,
		});
	}

	public equals(entity: ManagerModel) {
		if (entity === this) {
			return true
		}

		if (entity.id === this.id && JSON.stringify(entity) === JSON.stringify(this)) {
			return true
		}

		return false
	}
}