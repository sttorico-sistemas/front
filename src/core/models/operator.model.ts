import { BaseModel } from "src/core/models/base.model";

export class OperatorModel extends BaseModel {
	public id?: number
	public cpf: string
	public name: string
	public email?: string;
	public typeId: number;
	public typeName?: string;
	public permissions: number[]
	public permissionsRaw?: { id: string, title: string }[]

	constructor(props: {
		id?: number;
		name: string;
		cpf: string;
		email?: string;
		typeId: string;
		typeName?: string;
		permissions?: number[];
		permissionsRaw?: { id: string, title: string }[]
	}) {
		super();
		this.id = props.id;
		this.name = props.name;
		this.cpf = props.cpf;
		this.email = props.email;
		this.typeId = +props.typeId;
		this.typeName = props.typeName;
		this.permissions = props?.permissions ?? [];
		this.permissionsRaw = props?.permissionsRaw ?? [];
	}

	toRecord(): Record<string, any> {
		return {
			user_id: this.id,
			tipo_operador_id: this.typeId,
			permissoes: this.permissions,
		}
	}

	static fromRecord(record: Record<string, any>): OperatorModel {
		return new OperatorModel({
			id: record.id,
			name: record.user.nome,
			cpf: record.user.cpf,
			email: record.user.email,
			typeId: record.tipo_operador.id,
			typeName: record.tipo_operador.name,
			permissions: record.tipo_operador.permissions.map((data: Record<string, any>) => data.id),
			permissionsRaw: record.tipo_operador.permissions.map((data: Record<string, any>) => ({ id: `${data.id}`, title: data.related_name })),
		});
	}
}