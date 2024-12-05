import { PermissionModel } from "@/core/models/permission.model";
import { BaseModel } from "src/core/models/base.model";

export class ProfileModel extends BaseModel {
	public id?: number
	public name: string
	public description: string
	public createdAt?: Date;
	public updatedAt?: Date;
	public permissions: PermissionModel[];
	public permissionsId: number[];

	constructor(props: {
		id?: string;
		name: string;
		description: string;
		createdAt?: Date;
		updatedAt?: Date;
		permissions?: PermissionModel[];
		permissionsId?: number[];
	}) {
		super();
		this.id = props?.id ? +props.id : undefined;
		this.name = props.name;
		this.description = props.description;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
		this.permissions = props?.permissions ?? [];
		this.permissionsId = props?.permissionsId ?? [];
	}

	toRecord(): Record<string, any> {
		return {
			id: this?.id,
			name: this.name,
			description: this.description,
			permissions: this.permissionsId
		}
	}

	static fromRecord(record: Record<string, any>): ProfileModel {
		return new ProfileModel({
			id: record.id,
			name: record.name,
			description: record.description,
			createdAt: record.created_at,
			updatedAt: record.updated_at,
			permissions: record.permissions.map((data: Record<string, any>) => PermissionModel.fromRecord(data)),
		});
	}
}