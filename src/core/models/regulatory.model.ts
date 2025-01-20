import { ManagerModel } from "@/core/models/manager.model";
import { BaseModel } from "src/core/models/base.model";

export class RegulatoryModel extends BaseModel {
	public id?: number
	public type: string
	public consignerId: number
	public number: string
	public target: string
	public subject: string
	public publicationAt: string;
	public revocationAt: string;
	public status?: number

	constructor(props: {
		id?: number
		type: string
		consignerId: number
		number: string
		target: string;
		subject: string
		publicationAt: string;
		revocationAt: string;
		status?: number
	}) {
		super();
		this.id = props.id;
		this.type = props.type;
		this.consignerId = props.consignerId;
		this.number = props.number;
		this.target = props.target;
		this.subject = props.subject;
		this.publicationAt = props.publicationAt;
		this.revocationAt = props.revocationAt;
		this.status = props.status;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			assunto: this.subject,
			numero: this.number,
			data_publicacao: this.publicationAt,
			data_revogacao: this.revocationAt,
			objeto: this.target,
			tipo_normativo_id: this.type,
			consignante_id: this.consignerId,
		}
	}

	static fromRecord(record: Record<string, any>): RegulatoryModel {
		return new RegulatoryModel({
			id: record.id,
			consignerId: record.consignante_id,
			subject: record.assunto,
			type: record.tipo,
			target: record.objeto,
			number: record.numero,
			publicationAt: record.data_de_publicacao,
			revocationAt: record.data_de_revogacao,
			status: record.status,
		});
	}

	public equals(entity: RegulatoryModel) {
		if (entity === this) {
			return true
		}

		if (entity.id === this.id && JSON.stringify(entity) === JSON.stringify(this)) {
			return true
		}

		return false
	}
}