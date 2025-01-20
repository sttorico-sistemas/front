import { BaseModel } from "src/core/models/base.model";

export class ManagerModel extends BaseModel {
	public id?: number
	public name: string
	public typeOfBond: string = '1'
	public bondId: string
	public personId: string
	public position: string
	public department: string
	public phone: string
	public cellphone: string;
	public email: string;
	public status?: number

	constructor(props: {
		id?: number
		name: string
		typeOfBond?: string
		bondId: string
		personId: string
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
		this.typeOfBond = props?.typeOfBond ?? this.typeOfBond;
		this.bondId = props.bondId;
		this.personId = props.personId;
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
			vinculo_type: this.typeOfBond,
			vinculo_id: this.bondId,
			pessoa_id: this.personId,
			departamento: this.department,
			funcao: this.position,
			nome: this.name,
			telefone: this.phone,
			celular: this.cellphone,
			email: this.email,
		}
	}

	static fromRecord(record: Record<string, any>): ManagerModel {
		return new ManagerModel({
			id: record.id,
			name: record.nome,
			typeOfBond: record?.vinculo_type,
			bondId: record.vinculo_id,
			personId: record.pessoa_id,
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