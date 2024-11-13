import { BaseModel } from "src/core/models/base.model";
import { Pessoa } from "../types/pessoa";
import { EnderecoModel } from "./endereco.model";
import { Contato } from "../types/contato";
import { Endereco } from "../types/endereco";
import { ContatoModel } from "./contato.model";

export class PessoaModel extends BaseModel implements Pessoa {
	public id: number;
	public cpf: string;
	public nome: string;
	public dtNasc: string;
	public tpVinculo: string;
	public cidade?: string;
	public email?: string;
	public status?: string;
	public contratante: string;
	public contatos: ContatoModel[];
	public enderecos: EnderecoModel[];

	constructor(private props: {
		id: number;
		cpf: string;
		nome: string;
		dtNasc: string;
		tpVinculo: string;
		cidade?: string;
		email?: string;
		status?: string;
		contratante: string;
		contatos: Contato[];
		enderecos: Endereco[];
	}) {
		super();
		this.id = this.props.id;
		this.cpf = this.props.cpf;
		this.nome = this.props.nome;
		this.dtNasc = this.props.dtNasc;
		this.tpVinculo = this.props.tpVinculo;
		this.cidade = this.props.cidade;
		this.email = this.props.email;
		this.status = this.props.status;
		this.contratante = this.props.contratante;
		this.contatos = this.props.contatos.map((e) => new ContatoModel({
			tipoContatoId: e.tipoContatoId,
			telefone: e.telefone,
			celular: e.celular,
			email: e.email,
		}));
		this.enderecos = this.props.enderecos.map((e) => new EnderecoModel({
			id: e.id,
			cep: e.cep,
			cidade: e.cidade,
			createdAt: e.createdAt,
			deletedAt: e.deletedAt,
			updatedAt: e.updatedAt,
			tipoEnderecoId: e.tipoEnderecoId,
			logradouro: e.logradouro,
			cidadeId: e.cidadeId,
		}));
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			cpf: this.cpf,
			nome: this.nome,
			dt_nasc: PessoaModel.formatDate(this.dtNasc),
			tp_vinculo: this.tpVinculo,
			cidade: this.cidade,
			email: this.email,
			contratante: this.contratante,
			contatos: this.contatos.map((e) => e.toRecord()),
			enderecos: this.enderecos.map((e) => e.toRecord()),
		}
	}

	static formatDate(birthDate?: string) {
		if (!birthDate) {
			return '';
		}
		if (birthDate.includes('-')) {
			const date = new Date(birthDate);
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			return `${day}/${month}/${year}`;
		}
		const day = birthDate.split('/')[0];
		const month = birthDate.split('/')[1]
		const year = birthDate.split('/')[2];
		return `${year}-${month}-${day}`;
	}

	static fromRecord(record: Record<string, any>): PessoaModel {
		return new PessoaModel({
			id: record.id,
			cpf: record.cpf,
			nome: record.nome,
			dtNasc: PessoaModel.formatDate(record.dt_nasc),
			tpVinculo: record.tp_vinculo ?? '',
			cidade: record.cidade,
			email: record.email,
			status: record.status,
			contratante: record.contratante ?? '',
			contatos: (record.contatos as [] | undefined)?.map(
				(e) => ContatoModel.fromRecord(e),
			) ?? [],
			enderecos: (record.enderecos as [] | undefined)?.map(
				(e) => EnderecoModel.fromRecord(e),
			) ?? [],
		});
	}
}