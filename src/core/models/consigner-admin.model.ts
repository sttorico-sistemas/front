import { ServiceModel } from "@/core/models/service.model";
import { BaseModel } from "src/core/models/base.model";

export class ConsignerAdminModel extends BaseModel {
	public id?: number
	public name: string
	public cnpj: string
	public services: ServiceModel[]
	public entityTypeId: string
	public entityTypeName?: string;
	public status?: number

	constructor(props: {
		id?: number;
		name: string;
		cnpj: string;
		services: ServiceModel[];
		entityTypeId: string;
		entityTypeName?: string;
		status?: number;
	}) {
		super();
		this.id = props.id;
		this.name = props.name;
		this.cnpj = props.cnpj?.replace(/\D+/g, "");
		this.services = props?.services ?? [];
		this.entityTypeId = props.entityTypeId;
		this.entityTypeName = props.entityTypeName;
		this.status = props.status;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.name,
			cnpj: this.cnpj,
		}
	}

	static fromRecord(record: Record<string, any>): ConsignerAdminModel {
		return new ConsignerAdminModel({
			id: record.id,
			name: record.nome,
			cnpj: record.cnpj,
			services: record.servicos,
			entityTypeId: record.tipo_entidade_id,
			entityTypeName: record?.tipo_entidade_nome,
			status: record.status,
		});
	}

	public equals(entity: ConsignerAdminModel) {
		if (entity === this) {
			return true
		}

		if (entity.id === this.id && JSON.stringify(entity) === JSON.stringify(this)) {
			return true
		}

		return false
	}
}