import { PermissionModel } from "@/core/models/permission.model";
import { BaseModel } from "src/core/models/base.model";

export class ProfileModel extends BaseModel {
	public id: number
	public name: string
	public description: string
	public createdAt?: Date;
	public updatedAt?: Date;
	public permissions: PermissionModel[];

	constructor(private props: {
		id: number;
		name: string;
		description: string;
		createdAt?: Date;
		updatedAt?: Date;
		permissions: PermissionModel[];
	}) {
		super();
		this.id = this.props.id;
		this.name = this.props.name;
		this.description = this.props.description;
		this.createdAt = this.props.createdAt;
		this.updatedAt = this.props.updatedAt;
		this.permissions = this.props.permissions;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			created_at: this.createdAt,
			updated_at: this.updatedAt,
			permissions: this.permissions.map((permission) => permission.toRecord()),
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