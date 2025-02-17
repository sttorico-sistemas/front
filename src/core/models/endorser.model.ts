import { ManagerModel } from "@/core/models/manager.model";
import { BaseModel } from "src/core/models/base.model";

export class EndorserModel extends BaseModel {
	public id?: number
	public name: string
	public phone: string
	public cellphone: string;
	public email: string;
	public consigneeId: number;
	public endorserTypeId: number;
	public status?: number
	public manager: ManagerModel

	constructor(props: {
		id?: number
		name: string
		phone: string
		cellphone: string;
		email: string;
		consigneeId: number,
		endorserTypeId: string,
		status?: number
		manager: ManagerModel
	}) {
		super();
		this.id = props.id;
		this.name = props.name;
		this.phone = props.phone?.replace(/\D+/g, "");
		this.cellphone = props.cellphone?.replace(/\D+/g, "");
		this.email = props.email;
		this.status = props.status;
		this.consigneeId = props.consigneeId;
		this.endorserTypeId = +props.endorserTypeId;
		this.manager = props.manager;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.name,
			consignante_id: this.consigneeId,
			gestor_id: this.manager.id,
			tipo_averbador_id: this.endorserTypeId
		}
	}

	static fromRecord(record: Record<string, any>): EndorserModel {
		return new EndorserModel({
			id: record.id,
			name: record.nome,
			cellphone: record.gestor.celular,
			email: record.gestor.email,
			phone: record.gestor.telefone,
			status: record.status,
			consigneeId: record.consignante.id,
			manager: ManagerModel.fromRecord(record.gestor),
			endorserTypeId: record.tipo_averbador.id
		});
	}

	public equals(entity: EndorserModel) {
		if (entity === this) {
			return true
		}

		if (entity.id === this.id && JSON.stringify(entity) === JSON.stringify(this)) {
			return true
		}

		return false
	}
}