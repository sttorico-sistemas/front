import { defineStore } from "pinia";
import { Pessoa } from "../types/pessoa";
import { FiltrosPessoa } from "../types/filtros_pessoa";
import { Endereco } from "../types/endereco";
import { Contato } from "../types/contato";
import { PaginacaoArgs } from "src/core/types/paginacao.type";
import { PessoaRepository } from "../repositories/pessoa.repository";
import Swal from "sweetalert2";
import { BaseError } from "src/core/errors/base.error";
import { tabelasAuxiliaresStore as _tabelasAuxiliaresStore } from "src/modules/configuracoes/stores/tabelas_auxiliares.store";
import { EstadoUf } from "../types/estado";
import { TableValue } from "src/modules/configuracoes/types/table_value";
import { TabelasAuxiliaresRepository } from "src/modules/configuracoes/repositories/tabelas_auxiliares.repository";

const pessoaRepository = new PessoaRepository();
const tabelasAuxiliaresRepository = new TabelasAuxiliaresRepository();

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
		editingPessoa: <Partial<Pick<Pessoa, 'id'>> & Omit<Pessoa, 'id'>>{
			nome: '',
			cpf: '',
			email: '',
			contratante: '',
			tpVinculo: '',
			cidade: '',
			status: '',
			enderecos: [],
			contatos: [],
		},
		tipoEnderecos: <TableValue[]>[],
		loadingPessoas: false,
		showEditor: false,
		showDeleteDialog: false,
		deleting: false,
		fetchingPessoa: false,
		error: '',
	}),
	actions: {
		toggleEditor(show?: boolean, pessoa?: Pessoa) {
			this.editingPessoa = pessoa ?? {
				nome: '',
				cpf: '',
				email: '',
				contratante: '',
				tpVinculo: '',
				cidade: '',
				status: '',
				enderecos: [],
				contatos: [],
			};
			if (pessoa?.id && !pessoa.enderecos.length && !pessoa.contatos.length) {
				this.fetchPessoa(pessoa.id);
			}
			this.showEditor = show ?? !this.showEditor;
		},
		async fetchPessoa(id: number) {
			try {
				this.fetchingPessoa = true;
				const pessoa = await pessoaRepository.getPersonById(id);
				const localPessoa = this.pessoas.find((e) => e.id === id);
				if (localPessoa && pessoa) {
					localPessoa.enderecos.push(...pessoa.enderecos);
					localPessoa.contatos.push(...pessoa.contatos);
				}
			} catch (error) {
				if (error instanceof BaseError) {
					Swal.fire({
						icon: 'error',
						title: 'Erro ao buscar os dados da pessoa',
						text: error.message,
						showConfirmButton: false,
						timer: 1500,
					});
				}
			} finally {
				this.fetchingPessoa = false;
			}
		},
		updateEditingPessoa(pessoa: Partial<Pessoa>) {
			this.editingPessoa = {
				nome: pessoa.nome ?? this.editingPessoa.nome,
				cpf: pessoa.cpf ?? this.editingPessoa.cpf,
				email: pessoa.email ?? this.editingPessoa.email,
				contratante: pessoa.contratante ?? this.editingPessoa.contratante,
				tpVinculo: pessoa.tpVinculo ?? this.editingPessoa.tpVinculo,
				cidade: pessoa.cidade ?? this.editingPessoa.cidade,
				status: pessoa.status ?? this.editingPessoa.status,
				enderecos: pessoa.enderecos ?? this.editingPessoa.enderecos,
				contatos: pessoa.contatos ?? this.editingPessoa.contatos,
			};
		},
		toggleDeletePessoa(props?: {
			pessoa?: Pessoa,
			show?: boolean;
		}) {
			if (!props?.pessoa) {
				this.showDeleteDialog = false;
				return;
			}
			this.editingPessoa = props?.pessoa ?? this.editingPessoa;
			this.showDeleteDialog = props?.show ?? !this.showDeleteDialog;
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
				const tipoEnderecosResponse = await tabelasAuxiliaresRepository.getAllTableValues('tipo-endereco')
				this.tipoEnderecos = tipoEnderecosResponse;
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
		async savePerson() {
			try {
				const pessoa = this.editingPessoa;
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
		async deletePessoa() {
			try {
				if (!this.editingPessoa?.id) {
					return;
				}
				this.deleting = true;
				await pessoaRepository.deletePerson(this.editingPessoa.id);
				await this.getAllPessoas();
				this.showDeleteDialog = false;
				Swal.fire({
					icon: 'success',
					title: 'Pessoa Apagada!',
					showConfirmButton: false,
					timer: 1500,
				});
			} catch (error) {
				if (error instanceof BaseError) {
					Swal.fire({
						icon: 'error',
						title: 'Erro ao apagar pessoa!',
						text: error.message,
						showConfirmButton: false,
						timer: 1500,
					});
				}
			} finally {
				this.deleting = false;
			}
		}
	},
	getters: {
		editingAddresses(): {
			tipoEndereco: string;
			endereco: string;
			cidade: string;
			loadingCidades: boolean;
			uf?: EstadoUf;
		}[] {
			return this.pessoas.find((e) => e.id == this.editingPessoa.id)?.enderecos.map((e) => ({
				cidade: e.cidade.nome,
				endereco: e.logradouro,
				loadingCidades: false,
				tipoEndereco: this.tipoEnderecos.find((tipoEndereco) => tipoEndereco.id == e.tipoEnderecoId)?.nome ?? '',
				uf: e.cidade.estado?.uf,
			})) ?? [];
		},
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