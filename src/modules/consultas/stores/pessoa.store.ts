import { defineStore } from "pinia";
import { Pessoa } from "../types/pessoa";
import { FiltrosPessoa } from "../types/filtros_pessoa";
import { Endereco } from "../types/endereco";
import { Contato } from "../types/contato";
import { PaginacaoArgs } from "src/core/types/paginacao.type";
import { PessoaRepository } from "../repositories/pessoa.repository";
import Swal from "sweetalert2";
import { BaseError } from "src/core/errors/base.error";

const pessoaRepository = new PessoaRepository();

export const pessoaStore = defineStore('pessoaStore', {
	state: () => ({
		pessoas: <Pessoa[]>[],
		pagination: {
			limite: 10,
			page: 1,
			total: 0,
		},
		filters: <FiltrosPessoa>{
			cidade: '',
			cpf: '',
			nome: '',
			status: '',
			vinculo: '',
		},
		loadingPessoas: false,
		showEditor: false,
		error: '',
	}),
	actions: {
		toggleEditor(show?: boolean) {
			this.showEditor = show ?? !this.showEditor;
		},
		async applyFilter<K extends keyof FiltrosPessoa>(key: K) { },
		async clearFilter() { },
		async getAllPessoas(pagination?: PaginacaoArgs) {
			try {
				this.loadingPessoas = true;
				const response = await pessoaRepository.getAllPersons({
					page: pagination?.page ?? this.pagination.page,
					limit: pagination?.limit ?? this.pagination.limite,
				});
				console.log(response);
				this.pessoas = response.items;
				this.pagination.page = pagination?.page ?? this.pagination.page;
				this.pagination.total = response.total;
			} finally {
				this.loadingPessoas = false;
			}
		},
		async nextPage() {
			await this.getAllPessoas({
				page: this.pagination.page++,
				limit: this.pagination.limite,
			});
		},
		async previousPage() {
			await this.getAllPessoas({
				page: this.pagination.page--,
				limit: this.pagination.limite,
			});
		},
		async goToPage(page: number) {
			await this.getAllPessoas({
				page,
				limit: this.pagination.limite,
			});
			this.pagination.page = page;
		},
		async setLimit(limit: number) {
			this.pagination.limite = limit;
			this.getAllPessoas({
				limit: limit,
				page: this.pagination.page,
			});
		},
		async savePerson(pessoa: {
			id?: number;
			cpf: string;
			nome: string;
			vinculo: string;
			contratante: string;
			enderecos: Endereco[],
			contatos: Contato[],
		}) {
			try {
				this.error = '';
				if (pessoa.id) {
					await pessoaRepository.updatePerson({
						id: pessoa.id!,
						...pessoa,
					});
				} else {
					await pessoaRepository.createPerson(pessoa);
				}
				await this.getAllPessoas();
				this.showEditor = false;
				Swal.fire({
					icon: 'success',
					title: 'Pessoa criada!',
					showConfirmButton: false,
					timer: 1500,
				});
			} catch (error) {
				if (error instanceof BaseError) {
					this.error = error.message;
				}
			}
		},
	},
	getters: {
		pagina(): number {
			return this.pagination.page;
		},
		limite(): number {
			return this.pagination.limite;
		},
		total(): number {
			return this.pagination.total;
		},
	},
});