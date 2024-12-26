import { BaseModel } from "@/core/models/base.model";

export class InstructionOfProcedureModel extends BaseModel {
	public id?: number
	public type: string
	public number: string
	public instruction: string
	public publicationAt: string;
	public revocationAt: string;
	public status?: number

	constructor(props: {
		id?: number
		type: string
		number: string
		instruction: string;
		publicationAt: string;
		revocationAt: string;
		status?: number
	}) {
		super();
		this.id = props.id;
		this.type = props.type;
		this.number = props.number;
		this.instruction = props.instruction;
		this.publicationAt = props.publicationAt;
		this.revocationAt = props.revocationAt;
		this.status = props.status;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.type,
		}
	}

	static fromRecord(record: Record<string, any>): InstructionOfProcedureModel {
		return new InstructionOfProcedureModel({
			id: record.id,
			type: record.tipo,
			instruction: record.instrucao,
			number: record.numero,
			publicationAt: record.data_de_publicacao,
			revocationAt: record.data_de_revogacao,
			status: record.status,
		});
	}

	public equals(entity: InstructionOfProcedureModel) {
		if (entity === this) {
			return true
		}

		if (entity.id === this.id && JSON.stringify(entity) === JSON.stringify(this)) {
			return true
		}

		return false
	}
}