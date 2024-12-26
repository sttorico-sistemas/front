import { BaseModel } from "@/core/models/base.model";

export class LogModel extends BaseModel {

	public id?: number
	public type: string
	public componentName: string
	public operatorUsername: string
	public operatorName: string
	public ip: string
	public createdAt: string

	constructor(props: {
		id?: number;
		type: string;
		componentName: string;
		operatorUsername: string;
		operatorName: string;
		ip: string;
		createdAt: string;
	}) {
		super();
		this.id = props?.id ? +props.id : undefined;
		this.type = props.type;
		this.componentName = props.componentName;
		this.operatorUsername = props.operatorUsername;
		this.operatorName = props.operatorName;
		this.ip = props.ip;
		this.createdAt = props.createdAt;
	}

	toRecord(): Record<string, any> {
		throw new Error("Method not implemented.");
	}

	static fromRecord(record: Record<string, any>): LogModel {
		return new LogModel({
			id: record.id,
			type: record.type,
			componentName: record.componente,
			operatorName: record.operador,
			operatorUsername: record.username,
			ip: record.ip,
			createdAt: record.criado_em
		});
	}
}