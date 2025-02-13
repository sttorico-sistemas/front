import { AddressModel } from "@/core/models/address.model";
import { ServiceModel } from "@/core/models/service.model";
import { BaseModel } from "src/core/models/base.model";

export class ConsignerAdminModel extends BaseModel {
	public id?: number
	public name: string
	public shortName: string
	public cnpj: string
	public services: ServiceModel[]
	public entityTypeId: string
	public entityTypeName?: string;
	public status?: number
	public endorsement?: string
	public address?: AddressModel

	constructor(props: {
		id?: number;
		name: string;
		shortName?: string;
		cnpj: string;
		services: ServiceModel[];
		entityTypeId: string;
		entityTypeName?: string;
		status?: number;
		endorsement?: string
		address?: AddressModel
	}) {
		super();
		this.id = props.id;
		this.name = props.name;
		this.shortName = props.shortName ?? '';
		this.cnpj = props.cnpj?.replace(/\D+/g, "");
		this.services = props?.services ?? [];
		this.entityTypeId = props.entityTypeId;
		this.entityTypeName = props.entityTypeName;
		this.status = props.status;
		this.endorsement = props.endorsement
		this.address = props.address
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
			shortName: record.nome_curto,
			cnpj: record.cnpj,
			services: record.servicos.map((data: Record<string, any>) => ServiceModel.fromRecord(data)),
			entityTypeId: record.tipo_entidade.id,
			entityTypeName: record?.tipo_entidade.nome,
			status: record.status,
			endorsement: record.averbacao,
			address: AddressModel.fromRecord({
				id: 1,
				tipo_endereco_id: 1,
				tipo_endereco_nome: undefined,
				cidade_id: record.endereco?.cidade_id,
				cidade_nome: record.endereco?.cidade_nome,
				estado_id: record.endereco?.estado_id,
				estado_nome: record.endereco?.estado_nome,
				logradouro: record.endereco.logradouro,
				cep: record.endereco.cep
			})
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