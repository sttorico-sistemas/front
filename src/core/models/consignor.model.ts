import { AddressModel } from "@/core/models/address.model";
import { BaseModel } from "src/core/models/base.model";

export class ConsignorModel extends BaseModel {
	public id?: number;
	public name: string;
	public shortName: string;
	public cnpj: string;
	public masterConsignorId: string;
	public masterConsignorName?: string;
	public status?: number;
	public entityTypeId: string;
	public entityTypeName?: string;
	public startOfBusiness?: string | null;
	public endOfBusiness?: string | null;
	public addresses: AddressModel;

	constructor(props: {
		id?: number;
		name: string;
		shortName: string;
		cnpj: string;
		status?: number;
		startOfBusiness?: string | null;
		endOfBusiness?: string | null;
		masterConsignorId: string;
		masterConsignorName?: string;
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
		this.masterConsignorId = props.masterConsignorId;
		this.masterConsignorName = props.masterConsignorName;
		this.entityTypeId = props.entityTypeId;
		this.entityTypeName = props.entityTypeName;
		this.status = props.status;
		this.addresses = props.addresses;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.name,
			nome_curto: this.shortName,
			cnpj: this.cnpj,
			consignante_master_id: this.masterConsignorId,
			tipo_entidade_id: this.entityTypeId,
			endereco: this.addresses.toRecord(),
			inicio: this.startOfBusiness,
			fim: this.endOfBusiness,
		}
	}

	static fromRecord(record: Record<string, any>): ConsignorModel {
		return new ConsignorModel({
			id: record.id,
			name: record.nome,
			shortName: record.nome_curto,
			cnpj: record.cnpj,
			endOfBusiness: record.fim,
			startOfBusiness: record.inicio,
			entityTypeId: record.tipo_entidade_id,
			entityTypeName: record?.tipo_entidade_nome,
			masterConsignorId: record.consignante_master_id,
			masterConsignorName: record?.consignante_master_nome,
			status: record.status,
			addresses: AddressModel.fromRecord(record.endereco)
		});
	}

	public equals(entity: ConsignorModel) {
		if (entity === this) {
			return true
		}

		if (entity.id === this.id && JSON.stringify(entity) === JSON.stringify(this)) {
			return true
		}

		return false
	}
}