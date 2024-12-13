import { AddressModel } from "@/core/models/address.model";
import { BaseModel } from "src/core/models/base.model";

export class ConsignerModel extends BaseModel {
	public id?: number
	public name: string
	public shortName: string
	public cnpj: string
	public masterConsignerId: string
	public entityTypeId: string
	public addresses: AddressModel

	constructor(props: {
		id?: number;
		name: string;
		shortName: string;
		cnpj: string;
		masterConsignerId: string;
		entityTypeId: string;
		addresses: AddressModel;
	}) {
		super();
		this.id = props.id;
		this.name = props.name;
		this.shortName = props.shortName;
		this.cnpj = props.cnpj?.replace(/\D+/g, "");
		this.masterConsignerId = props.masterConsignerId;
		this.entityTypeId = props.entityTypeId;
		this.addresses = props.addresses;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.name,
			nome_curto: this.shortName,
			cnpj: this.cnpj,
			consignante_master_id: this.masterConsignerId,
			tipo_entidade_id: this.entityTypeId,
			endereco: this.addresses.toRecord()
		}
	}

	static fromRecord(record: Record<string, any>): ConsignerModel {
		return new ConsignerModel({
			id: record.id,
			name: record.nome,
			shortName: record.nome_curto,
			cnpj: record.cnpj,
			entityTypeId: record.tipo_entidade_id,
			masterConsignerId: record.consignante_master_id,
			addresses:  AddressModel.fromRecord(record.endereco)
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