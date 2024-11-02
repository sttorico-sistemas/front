import { BaseModel } from "src/core/models/base.model";
import { Estado, EstadoUf } from "../types/estado";

export class EstadoModel extends BaseModel implements Estado {
	public id: number;
	public nome: string;
	public uf: EstadoUf;
	public createdAt: Date;
	public updatedAt: Date;
	public deletedAt?: Date;
	public ibgeId: number;

	constructor(private props: {
		id: number;
		nome: string;
		uf: EstadoUf;
		createdAt: Date;
		updatedAt: Date;
		deletedAt?: Date;
		ibgeId: number;
	}) {
		super();
		this.id = this.props.id;
		this.nome = this.props.nome;
		this.uf = this.props.uf;
		this.createdAt = this.props.createdAt;
		this.updatedAt = this.props.updatedAt;
		this.deletedAt = this.props.deletedAt;
		this.ibgeId = this.props.ibgeId;
	}

	static fromRecord(record: Record<string, any>): EstadoModel {
		if (!record) {
			return EstadoModel.empty();
		}
		return new EstadoModel({
			id: record.id,
			nome: record.nome,
			uf: record.uf,
			createdAt: record.created_at,
			updatedAt: record.updated_at,
			deletedAt: record.deleted_at,
			ibgeId: record.ibge_id,
		});
	}

	static empty(): EstadoModel {
		return new EstadoModel({
			id: 0,
			nome: '',
			ibgeId: 0,
			uf: 'RO',
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: undefined,
		});
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			nome: this.nome,
			uf: this.uf,
			created_at: this.createdAt,
			updated_at: this.updatedAt,
			deleted_at: this.deletedAt,
			ibge_id: this.ibgeId,
		}
	}
}