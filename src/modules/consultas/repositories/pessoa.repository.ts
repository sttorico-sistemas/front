import { Pessoa } from "../types/pessoa";
import { PessoaModel } from "../models/pessoa.model";
import { BaseError } from "src/core/errors/base.error";
import { PaginatedResultOutput, PaginacaoArgs } from "src/core/types/paginacao.type.d";
import { Contato } from "../types/contato";
import { Endereco } from "../types/endereco";
import { useAxios } from "src/core/composables/use_axios";

export class PessoaRepository {
	private http = useAxios();

	async getAllPersons(pagination?: PaginacaoArgs, query?: string): Promise<PaginatedResultOutput<Pessoa>> {
		try {
			const response = await this.http.get<{ data: { data: any[], meta: any } }>('/pessoas', {
				params: {
					'per_page': pagination?.limit ?? 10,
					'page': pagination?.page ?? 1,
					'search': query,
				}
			});
			console.log(response)
			return {
				total: response.data.meta.total,
				items: (response.data.data as []).map(
					(e) => PessoaModel.fromRecord(e),
				),
			}
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getPersonById(id: number): Promise<Pessoa | undefined> {
		try {
			const response = await this.http.get<{ data: any }>(`/pessoas/${id}`);
			return PessoaModel.fromRecord(response.data);
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async createPerson(pessoa: {
		cpf: string;
		nome: string;
		tpVinculo: string;
		contratante: string;
		dtNasc: string;
		cidade?: string;
		email?: string;
		status?: string;
		enderecos: Endereco[],
		contatos: Contato[],
	}): Promise<Pessoa> {
		try {
			const response = await this.http.post('/pessoas', {
				nome: pessoa.nome,
				cpf: pessoa.cpf.replace(/\D+/g, ""),
				status: pessoa.status,
				dt_nasc: PessoaModel.formatDate(pessoa.dtNasc),
				enderecos: pessoa.enderecos.map((e) => ({
					logradouro: e.logradouro,
					cep: e.cep.replace(/\D+/g, ""),
					cidade_id: e.cidadeId,
					tipo_endereco_id: e.tipoEnderecoId,
				})),
				contatos: pessoa.contatos.map((e) => ({
					telefone: e.telefone.replace(/\D+/g, ""),
					celular: e.celular.replace(/\D+/g, ""),
					tipo_contato_id: e.tipoContatoId,
					email: e.email
				}))
			});
			return response.data;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updatePerson(pessoa: Pessoa): Promise<void> {
		try {
			await this.http.put(`/pessoas/${pessoa.id}`, {
				id: pessoa.id,
				nome: pessoa.nome,
				cpf: pessoa.cpf.replace(/\D+/g, ""),
				status: pessoa.status,
				dt_nasc: PessoaModel.formatDate(pessoa.dtNasc),
				enderecos: pessoa.enderecos.map((e) => ({
					logradouro: e.logradouro,
					cep: e.cep.replace(/\D+/g, ""),
					cidade_id: e.cidadeId,
					tipo_endereco_id: e.tipoEnderecoId,
				})),
				contatos: pessoa.contatos.map((e) => ({
					telefone: e.telefone.replace(/\D+/g, ""),
					celular: e.celular.replace(/\D+/g, ""),
					tipo_contato_id: e.tipoContatoId,
					email: e.email
				}))
			},);
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async deletePerson(id: number): Promise<void> {
		try {
			await this.http.delete(`/pessoas/${id}`);
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}