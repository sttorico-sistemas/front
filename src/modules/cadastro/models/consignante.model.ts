import { BaseModel } from "src/core/models/base.model";
import { Consignante } from "../types/consignante";
import { Expediente } from "../types/consignante";
import { Endereco } from "src/modules/consultas/types/endereco";
import { EnderecoModel } from "src/modules/consultas/models/endereco.model";

export class ConsignanteModel extends BaseModel implements Consignante {
	public id: number;
	public consignanteMasterId: number;
	public tipoEntidadeId: number;
	public cnpj: string;
	public nome: string;
	public nomeCurto: string;
	public status: string;
	public averbacao: string;
	public dtInicial: string;
	public dtFinal: string;
	public enderecos: EnderecoModel[];
	public expediente: Expediente;

	constructor(private props: {
		id: number;
		consignanteMasterId: number;
		tipoEntidadeId: number;
		cnpj: string;
		nome: string;
		nomeCurto: string;
		status: string;
		averbacao: string;
		dtInicial: string;
		dtFinal: string;
		enderecos: Endereco[];
		expediente: Expediente;
	}) {
		super();
		this.id = this.props.id;
		this.consignanteMasterId = this.props.consignanteMasterId;
		this.tipoEntidadeId = this.props.tipoEntidadeId;
		this.cnpj = this.props.cnpj;
		this.nome = this.props.nome;
		this.nomeCurto = this.props.nomeCurto;
		this.status = this.props.status;
		this.averbacao = this.props.averbacao;
		this.dtInicial = this.props.dtInicial;
		this.dtFinal = this.props.dtFinal;
		this.enderecos = this.props.enderecos.map(endereco => EnderecoModel.fromRecord(endereco));
		this.expediente = this.props.expediente;
	}

	static fromRecord(record: Record<string, any>): ConsignanteModel {
		return new ConsignanteModel({
			id: record.id,
			consignanteMasterId: record.consignante_master_id,
			tipoEntidadeId: record.tipo_entidade_id,
			cnpj: record.cnpj,
			nome: record.nome,
			nomeCurto: record.nome_curto,
			status: record.status,
			averbacao: record.averbacao,
			dtInicial: record.dt_inicial,
			dtFinal: record.dt_final,
			enderecos: record.enderecos.map((endereco: Record<string, any>) => EnderecoModel.fromRecord(endereco)),
			expediente: record.expediente,
		});
	}

	toRecord(): Record<string, any> {
		return {
			id: this.id,
			consignante_master_id: this.consignanteMasterId,
			tipo_entidade_id: this.tipoEntidadeId,
			cnpj: this.cnpj,
			nome: this.nome,
			nome_curto: this.nomeCurto,
			status: this.status,
			averbacao: this.averbacao,
			dt_inicial: this.dtInicial,
			dt_final: this.dtFinal,
			enderecos: this.enderecos.map(endereco => endereco.toRecord()),
			expediente: this.expediente,
		};
	}
}