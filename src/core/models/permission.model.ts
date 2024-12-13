import { BaseModel } from "src/core/models/base.model";

export class PermissionModel extends BaseModel {
	public id: number
	public action: string
	public permissibleType: string
	public permissibleId: string
	public relatedName: string
	public createdAt?: Date;
	public updatedAt?: Date;

	constructor(private props: {
		id: number;
		action: string;
		permissibleType: string;
		permissibleId: string;
		relatedName: string;
		createdAt?: Date;
		updatedAt?: Date;

	}) {
		super();
		this.id = this.props.id;
		this.action = this.props.action;
		this.permissibleType = this.props.permissibleType;
		this.permissibleId = this.props.permissibleId;
		this.relatedName = this.props.relatedName;
		this.createdAt = this.props.createdAt;
		this.updatedAt = this.props.updatedAt;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			action: this.action,
			permissionable_type: this.permissibleType,
			permissionable_id: this.permissibleId,
			related_name: this.relatedName,
			created_at: this.createdAt,
			updated_at: this.updatedAt,
		}
	}

	static fromRecord(record: Record<string, any>): PermissionModel {
		return new PermissionModel({
			id: record.id,
			action: record.action,
			permissibleType: record.permissionable_type,
			permissibleId: record.permissionable_id,
			relatedName: record.related_name,
			createdAt: record.created_at,
			updatedAt: record.updated_at,
		});
	}

	public equals(entity: PermissionModel) {
		if (entity === this) {
			return true
		}

		if (entity.id === this.id) {
			return true
		}

		return false
	}
}