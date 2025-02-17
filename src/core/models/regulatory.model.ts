import { ManagerModel } from "@/core/models/manager.model";
import { BaseModel } from "src/core/models/base.model";

export class RegulatoryModel extends BaseModel {
	public id?: number
	public typeId: string
	public typeOfBond: string = '1'
	public bondId: string
	public number: string
	public target: string
	public typeName?: string
	public subject: string
	public publicationAt: string;
	public revocationAt?: string;
	public status?: string

	constructor(props: {
		id?: number
		typeId: string
		typeOfBond?: string
		bondId: string
		number: string
		target: string;
		typeName?: string
		subject: string
		publicationAt: string;
		revocationAt?: string;
		status?: string
	}) {
		super();
		this.id = props.id;
		this.typeId = props.typeId;
		this.typeOfBond = props?.typeOfBond ?? this.typeOfBond;
		this.bondId = props.bondId;
		this.number = props.number;
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
			tipo_normativo_id: this.typeId,
			vinculo_type: this.typeOfBond,
			vinculo_id: this.bondId,
		}
	}

	static fromRecord(record: Record<string, any>): RegulatoryModel {
		return new RegulatoryModel({
			id: record.id,
			typeOfBond: record?.vinculo.nome,
			bondId: record.vinculo.id,
			subject: record.assunto,
			typeId: record.tipo_normativo.id,
			typeName: record.tipo_normativo.nome,
			target: '',
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