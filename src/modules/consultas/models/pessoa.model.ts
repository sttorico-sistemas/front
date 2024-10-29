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
  public vinculo: string;
  public contratante: string;
  public contatos: ContatoModel[];
  public enderecos: EnderecoModel[];

  constructor(private props: {
    id: number;
    cpf: string;
    nome: string;
    vinculo: string;
    contratante: string;
    contatos: Contato[];
    enderecos: Endereco[];
  }) {
    super();
    this.id = this.props.id;
    this.cpf = this.props.cpf;
    this.nome = this.props.nome;
    this.vinculo = this.props.vinculo;
    this.contratante = this.props.contratante;
    this.contatos = this.props.contatos.map((e) => new ContatoModel({
      tipoContatoId: e.tipoContatoId,
      telefone: e.telefone,
      celular: e.celular,
      email: e.email,
    }));
    this.enderecos = this.props.enderecos.map((e) => new EnderecoModel({
      tipoEnderecoId: e.tipoEnderecoId,
      endereco: e.endereco,
      cidadeId: e.cidadeId,
    }));
  }

  toRecord(): Record<string, any> {
    return {
      id: this.id,
      cpf: this.cpf,
      nome: this.nome,
      vinculo: this.vinculo,
      contratante: this.contratante,
      contatos: this.contatos.map((e) => e.toRecord()),
      enderecos: this.enderecos.map((e) => e.toRecord()),
    }
  }

  static fromRecord(record: Record<string, any>): PessoaModel {
    return new PessoaModel({
      id: record.id,
      cpf: record.cpf,
      nome: record.nome,
      vinculo: record.vinculo ?? '',
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