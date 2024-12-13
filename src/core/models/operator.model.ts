import { BaseModel } from "src/core/models/base.model";

export class OperatorModel extends BaseModel {
	public id?: number
	public cpf: string
	public name: string
	public email?: string;
	public typeId: number;
	public userId?: number;
	public personId?: number;
	public typeName?: string;
	public status?: string;
	public permissions: number[]
	public deletedPermissions: number[]
	public permissionsRaw?: { id: string, title: string }[]

	constructor(props: {
		id?: number;
		userId?: string;
		personId?: string;
		name: string;
		cpf: string;
		email?: string;
		typeId: string;
		status?: string;
		typeName?: string;
		permissions?: number[];
		deletedPermissions?: number[];
		permissionsRaw?: { id: string, title: string }[]
	}) {
		super();
		this.id = props.id;
		this.name = props.name;
		this.cpf = props.cpf.replace(/\D+/g, '');
		this.email = props.email;
		this.typeId = +props.typeId;
		this.typeName = props.typeName;
		this.status = props.status;
		this.userId = props?.userId ? +props.userId : undefined;
		this.personId = props?.personId ? +props.personId : undefined;
		this.permissions = props?.permissions ?? [];
		this.deletedPermissions = props?.deletedPermissions ?? [];
		this.permissionsRaw = props?.permissionsRaw ?? [];
	}

	toRecord(): Record<string, any> {
		return {
			user_id: this.userId,
			pessoa_id: this.personId,
			tipo_operador_id: this.typeId,
			adicionar_permissoes: this.permissions,
			remover_permissoes: this.deletedPermissions,
		}
	}

	static fromRecord(record: Record<string, any>): OperatorModel {
		return new OperatorModel({
			id: record.id,
			userId: record.user.id,
			name: record.user.nome,
			cpf: record.user.cpf,
			email: record.user.email,
			typeId: record.tipo_operador.id,
			status: record.status,
			typeName: record.tipo_operador.name,
			permissions: record.permissions,
			permissionsRaw: record.permissions.map((id: number) => ({ id: `${id}`, title: '' })),
		});
	}
}