import { BaseModel } from "src/core/models/base.model";

type TreeList = { id: string, title: string, children?: TreeList[] }

export class PermissionTreeModel extends BaseModel {
	public id: number
	public permissionId: number
	public name: string
	public type: string
	public children: PermissionTreeModel[]

	constructor(props: {
		id: number;
		permissionId: number,
		name: string;
		type: string;
		children: PermissionTreeModel[];
	}) {
		super();
		this.id = props.id;
		this.permissionId = props.permissionId;
		this.name = props.name;
		this.type = props.type;
		this.children = props?.children;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			name: this.name,
			type: this.type,
			children: this.children.map(data => data.toRecord()),
		}
	}

	toList(): TreeList {
		return {
			id: `${this.permissionId}`,
			title: this.name,
			children: this.children.length > 0 ? this.children.map(data => data.toList()) : undefined,
		}
	}

	static fromRecord(record: Record<string, any>): PermissionTreeModel {
		return new PermissionTreeModel({
			id: record.id,
			permissionId: record?.permission?.id,
			name: record.name,
			type: record.type,
			children: record.children.map((data: any) => PermissionTreeModel.fromRecord(data)),
		});
	}
}