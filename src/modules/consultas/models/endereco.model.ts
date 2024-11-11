import { BaseModel } from "src/core/models/base.model";
import { Endereco } from "../types/endereco";
import { Cidade } from "../types/cidade";
import { CidadeModel } from "./cidade.model";
import { EstadoModel } from "./estado.model";

export class EnderecoModel extends BaseModel implements Endereco {
	public id: number;
	public logradouro: string;
	public cep: string;
	public cidadeId: number;
	public tipoEnderecoId: number;
	public cidade: CidadeModel;
	public createdAt: Date;
	public updatedAt: Date;
	public deletedAt?: Date;

	constructor(private props: {
		id: number;
		logradouro: string;
		cep: string;
		cidadeId: number;
		tipoEnderecoId: number;
		cidade: Cidade;
		createdAt: Date;
		updatedAt: Date;
		deletedAt?: Date;
	}) {
		super();
		this.id = this.props.id;
		this.logradouro = this.props.logradouro;
		this.cep = this.props.cep;
		this.cidadeId = this.props.cidadeId;
		this.tipoEnderecoId = this.props.tipoEnderecoId;
		this.cidade = new CidadeModel({
			createdAt: this.props.cidade.createdAt,
			estadoId: this.props.cidade.estadoId,
			ibgeId: this.props.cidade.ibgeId,
			id: this.props.cidade.id,
			nome: this.props.cidade.nome,
			estado: this.props.cidade.estado ?? EstadoModel.empty(),
			updatedAt: this.props.cidade.updatedAt,
			deletedAt: this.props.cidade.deletedAt,
		});
		this.createdAt = this.props.createdAt;
		this.updatedAt = this.props.updatedAt;
		this.deletedAt = this.props.deletedAt;
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			tipo_endereco_id: this.tipoEnderecoId,
			logradouro: this.logradouro,
			cidade_id: this.cidadeId,
			cep: this.cep,
			cidade: this.cidade.toRecord(),
			created_at: this.createdAt,
			deleted_at: this.deletedAt,
			updated_at: this.updatedAt,
		}
	}

	static fromRecord(record: Record<string, any>): EnderecoModel {
		return new EnderecoModel({
			id: record.id,
			cep: record.cep,
			tipoEnderecoId: record.tipo_endereco_id,
			logradouro: record.logradouro,
			cidadeId: record.cidade_id,
			cidade: CidadeModel.fromRecord(record.cidade),
			createdAt: new Date(record.created_at),
			updatedAt: new Date(record.updated_at),
			deletedAt: record.deleted_at ? new Date(record.deleted_at) : undefined,
		});
	}
}