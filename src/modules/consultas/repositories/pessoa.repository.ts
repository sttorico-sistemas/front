// import { useAxios } from "src/core/composables/use_axios";
// import { Person } from "../types/pessoa";
// import { PessoaModel } from "../models/pessoa.model";
// import { BaseError } from "src/core/errors/base.error";
// import { PaginatedResultOutput, PaginacaoArgs } from "src/core/types/paginacao.type.d";

// export class PersonRepository {
//   private http = useAxios();

//   private getPessoaModel(pessoa: Person): PessoaModel {
//     return new PessoaModel({
//       cpf: pessoa.cpf,
//       name: pessoa.name,
//       vinculo: pessoa.vinculo,
//       contratante: pessoa.contratante,
//       contacts: pessoa.contacts,
//       addresses: pessoa.addresses,
//     });
//   }

//   async getAllPersons(pagination?: PaginacaoArgs, query?: string): Promise<PaginatedResultOutput<Person>> {
//     try {
//       const response = await this.http.get('/pessoas', {
//         params: {
//           'per_page': pagination?.limit ?? 10,
//           'page': pagination?.page ?? 1,
//           'search': query,
//         }
//       });
//       return {
//         total: response.data.data.meta.total,
//         items: (response.data.data.data as []).map(
//           (e) => PessoaModel.fromRecord(e),
//         ),
//       }
//     } catch (error) {
//       throw BaseError.fromHttpError(error);
//     }
//   }

//   async getPersonById(id: number): Promise<Person> {
//     try {
//       const response = await this.http.get(`/pessoas/${id}`);
//       return PessoaModel.fromRecord(response.data.data);
//     } catch (error) {
//       throw BaseError.fromHttpError(error);
//     }
//   }

//   async createPerson(pessoa: Person): Promise<Person> {
//     try {
//       const pessoaModel = this.getPessoaModel(pessoa);
//       const response = await this.http.post('/pessoas', pessoaModel.toRecord());
//       return PessoaModel.fromRecord(response.data.data);
//     } catch (error) {
//       throw BaseError.fromHttpError(error);
//     }
//   }

//   async updatePerson(pessoa: Person): Promise<void> {
//     try {
//       const pessoaModel = this.getPessoaModel(pessoa);
//       await this.http.put(`/pessoas/${pessoa.cpf}`, pessoaModel.toRecord());
//     } catch (error) {
//       throw BaseError.fromHttpError(error);
//     }
//   }

//   async deletePerson(cpf: string): Promise<void> {
//     try {
//       await this.http.delete(`/pessoas/${cpf}`);
//     } catch (error) {
//       throw BaseError.fromHttpError(error);
//     }
//   }
// }
import { Pessoa } from "../types/pessoa";
import { PessoaModel } from "../models/pessoa.model";
import { BaseError } from "src/core/errors/base.error";
import { PaginatedResultOutput, PaginacaoArgs } from "src/core/types/paginacao.type.d";
import { Contato } from "../types/contato";
import { Endereco } from "../types/endereco";

export class PessoaRepository {
	private localStorageKey = 'pessoaRepository';

	private getPessoaModel(pessoa: Pessoa): PessoaModel {
		return new PessoaModel({
			id: pessoa.id,
			cpf: pessoa.cpf,
			nome: pessoa.nome,
			vinculo: pessoa.vinculo,
			contratante: pessoa.contratante,
			contatos: pessoa.contatos,
			enderecos: pessoa.enderecos,
		});
	}

	private async loadFromLocalStorage(): Promise<Pessoa[]> {
		const storedData = localStorage.getItem(this.localStorageKey);
		if (storedData) {
			return JSON.parse(storedData).map((p: Record<string, any>) => PessoaModel.fromRecord(p));
		}
		return [];
	}

	private async saveToLocalStorage(pessoas: Pessoa[]): Promise<void> {
		localStorage.setItem(this.localStorageKey, JSON.stringify(pessoas.map(p => this.getPessoaModel(p).toRecord())));
	}

	async getAllPersons(pagination?: PaginacaoArgs, query?: string): Promise<PaginatedResultOutput<Pessoa>> {
		try {
			// Load from local storage
			const localPersons = await this.loadFromLocalStorage();
			// Filter by query
			const filteredPersons = query ? localPersons.filter(p => p.nome.toLowerCase().includes(query.toLowerCase())) : localPersons;
			// Apply pagination
			const startIndex = ((pagination?.page ?? 1) - 1) * (pagination?.limit ?? 10);
			const endIndex = startIndex + (pagination?.limit ?? 10);
			const paginatedPersons = filteredPersons.slice(startIndex, endIndex);
			const response = {
				total: filteredPersons.length,
				items: paginatedPersons,
			};
			return response;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getPersonById(id: number): Promise<Pessoa | undefined> {
		try {
			const localPersons = await this.loadFromLocalStorage();
			const pessoa = localPersons.find(p => p.id === id);
			return pessoa;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async createPerson(pessoa: {
		cpf: string;
		nome: string;
		vinculo: string;
		contratante: string;
		enderecos: Endereco[],
		contatos: Contato[],
	}): Promise<Pessoa> {
		try {
			// Create pessoa
			const pessoaModel = this.getPessoaModel({
				id: 12,
				...pessoa,
			});
			// Load from local storage
			const localPersons = await this.loadFromLocalStorage();
			// Add pessoa to local storage
			localPersons.push(pessoaModel);
			await this.saveToLocalStorage(localPersons);
			return pessoaModel;
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updatePerson(pessoa: Pessoa): Promise<void> {
		try {
			// Update pessoa
			const pessoaModel = this.getPessoaModel(pessoa);
			// Load from local storage
			const localPersons = await this.loadFromLocalStorage();
			// Find pessoa in local storage
			const index = localPersons.findIndex(p => p.cpf === pessoa.cpf);
			if (index !== -1) {
				// Update pessoa in local storage
				localPersons[index] = pessoaModel;
				await this.saveToLocalStorage(localPersons);
			} else {
				throw new BaseError({
					code: 404,
					message: 'Person not found',
					errors: {},
				},
				);
			}
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async deletePerson(cpf: string): Promise<void> {
		try {
			// Delete pessoa
			// Load from local storage
			const localPersons = await this.loadFromLocalStorage();
			// Find pessoa in local storage
			const index = localPersons.findIndex(p => p.cpf === cpf);
			if (index !== -1) {
				// Remove pessoa from local storage
				localPersons.splice(index, 1);
				await this.saveToLocalStorage(localPersons);
			} else {
				throw new BaseError({
					code: 404,
					message: 'Person not found',
					errors: {},
				},
				);
			}
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}