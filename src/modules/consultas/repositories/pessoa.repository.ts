import { Pessoa } from "../types/pessoa";
import { PessoaModel } from "../models/pessoa.model";
import { BaseError } from "src/core/errors/base.error";
import { PaginatedResultOutput, PaginacaoArgs } from "src/core/types/paginacao.type.d";
import { Contato } from "../types/contato";
import { Endereco } from "../types/endereco";
import { useAxios } from "src/core/composables/use_axios";

export class PessoaRepository {
	private http = useAxios();

	private getPessoaModel(pessoa: Pessoa): PessoaModel {
		return new PessoaModel({
			id: pessoa.id,
			cpf: pessoa.cpf,
			nome: pessoa.nome,
			tpVinculo: pessoa.tpVinculo,
			cidade: pessoa.cidade,
			email: pessoa.email,
			status: pessoa.status,
			contratante: pessoa.contratante,
			contatos: pessoa.contatos,
			enderecos: pessoa.enderecos,
		});
	}

	async getAllPersons(pagination?: PaginacaoArgs, query?: string): Promise<PaginatedResultOutput<Pessoa>> {
		try {
			const response = await this.http.get('/pessoas', {
				params: {
					'per_page': pagination?.limit ?? 10,
					'page': pagination?.page ?? 1,
					'search': query,
				}
			});
			return {
				total: response.data.data.meta.total,
				items: (response.data.data.data as []).map(
					(e) => PessoaModel.fromRecord(e),
				),
			}
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getPersonById(id: number): Promise<Pessoa | undefined> {
		try {
			const response = await this.http(`/pessoas/${id}`)
			return PessoaModel.fromRecord(response.data.data[0]);
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async createPerson(pessoa: {
		cpf: string;
		nome: string;
		tpVinculo: string;
		contratante: string;
		cidade?: string;
		email?: string;
		status?: string;
		enderecos: Endereco[],
		contatos: Contato[],
	}): Promise<Pessoa> {
		try {
			const pessoaModel = this.getPessoaModel({
				id: 0,
				...pessoa,
			});
			const response = await this.http.post('/pessoas', pessoaModel.toRecord());
			return response.data;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updatePerson(pessoa: Pessoa): Promise<void> {
		try {
			const pessoaModel = this.getPessoaModel(pessoa);
			await this.http.put(`/pessoas/${pessoa.id}`, pessoaModel.toRecord(),);
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async deletePerson(id: string): Promise<void> {
		try {
			await this.http.delete(`/pessoas/${id}`);
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}