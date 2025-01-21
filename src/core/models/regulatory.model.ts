import { ManagerModel } from "@/core/models/manager.model";
import { BaseModel } from "src/core/models/base.model";

export class RegulatoryModel extends BaseModel {
	public id?: number
	public type: string
	public consignerId: number
	public number: string
	public target: string
	public typeName?: string
	public subject: string
	public publicationAt: string;
	public revocationAt: string;
	public status?: string

	constructor(props: {
		id?: number
		type: string
		consignerId: number
		number: string
		target: string;
		typeName?: string
		subject: string
		publicationAt: string;
		revocationAt: string;
		status?: string
	}) {
		super();
		this.id = props.id;
		this.type = props.type;
		this.consignerId = props.consignerId;
		this.number = props.number;
		this.target = props.target;
		this.target = props.target;
		this.typeName = props.typeName;
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
			consignerId: record.consignante.id,
			subject: record.assunto,
			type: record.tipo_normativo.id,
			typeName: record.tipo_normativo.nome,
			target: record.assunto,
			number: record.numero,
			publicationAt: record.data_publicacao,
			revocationAt: record.data_revogacao,
			status: record.situacao,
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