import { AddressModel } from "@/core/models/address.model";
import { BaseModel } from "src/core/models/base.model";

export class ConsignerModel extends BaseModel {
	public id?: number
	public name: string
	public shortName: string
	public cnpj: string
	public masterConsignerId: string
	public masterConsignerName?: string;
	public status?: number
	public entityTypeId: string
	public entityTypeName?: string;
	public startOfBusiness?: string | null;
	public endOfBusiness?: string | null;
	public addresses: AddressModel
	public endorsement?: string

	constructor(props: {
		id?: number;
		name: string;
		shortName: string;
		cnpj: string;
		status?: number;
		endorsement?: string
		startOfBusiness?: string | null;
		endOfBusiness?: string | null;
		masterConsignerId: string;
		masterConsignerName?: string;
		entityTypeId: string;
		entityTypeName?: string;
		addresses: AddressModel;
	}) {
		super();
		this.id = props.id;
		this.name = props.name;
		this.startOfBusiness = props.startOfBusiness;
		this.endOfBusiness = props.endOfBusiness;
		this.shortName = props.shortName;
		this.cnpj = props.cnpj?.replace(/\D+/g, "");
		this.masterConsignerId = props.masterConsignerId;
		this.masterConsignerName = props.masterConsignerName;
		this.entityTypeId = props.entityTypeId;
		this.entityTypeName = props.entityTypeName;
		this.status = props.status;
		this.addresses = props.addresses;
		this.endorsement = props.endorsement
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.name,
			nome_curto: this.shortName,
			cnpj: this.cnpj,
			consignante_master_id: this.masterConsignerId,
			tipo_entidade_id: this.entityTypeId,
			endereco: this.addresses.toRecord(),
			inicio: this.startOfBusiness,
			fim: this.endOfBusiness,
		}
	}

	static fromRecord(record: Record<string, any>): ConsignerModel {
		return new ConsignerModel({
			id: record.id,
			name: record.nome,
			shortName: record.nome_curto,
			cnpj: record.cnpj,
			endOfBusiness: record.fim?.slice(0, -3),
			startOfBusiness: record.inicio?.slice(0, -3),
			entityTypeId: record.tipo_entidade_id,
			entityTypeName: record?.tipo_entidade_nome,
			masterConsignerId: record.consignante_master_id,
			masterConsignerName: record?.consignante_master_nome,
			status: record.status,
			endorsement: record.endorsement,
			addresses: AddressModel.fromRecord(record.endereco)
		});
	}

	public equals(entity: ConsignerModel) {
		if (entity === this) {
			return true
		}

		if (entity.id === this.id && JSON.stringify(entity) === JSON.stringify(this)) {
			return true
		}

		return false
	}
}