import { defineStore } from "pinia";
import { Consignante } from "../types/consignante";
import { PaginacaoArgs } from "src/core/types/paginacao.type";
import { ConsignanteRepository } from "../repositories/consignante.repository";
import Swal from "sweetalert2";
import { BaseError } from "src/core/errors/base.error";
import { tabelasAuxiliaresStore as _tabelasAuxiliaresStore } from "src/modules/configuracoes/stores";
import { TableValue } from "src/modules/configuracoes/types";
import { TabelasAuxiliaresRepository } from "src/modules/configuracoes/repositories/tabelas_auxiliares.repository";
import { EstadoUf } from "src/modules/consultas/types/estado";

const consignanteRepository = new ConsignanteRepository();
const tabelasAuxiliaresRepository = new TabelasAuxiliaresRepository();

export const consignanteStore = defineStore('consignanteStore', {
	state: () => ({
		consignantes: <Consignante[]>[],
		pagination: {
			limite: 10,
			page: 1,
			total: 0,
		},
		editingConsignante: <Partial<Pick<Consignante, 'id'>> & Omit<Consignante, 'id'>>{
			consignanteMasterId: 0,
			tipoEntidadeId: 0,
			cnpj: '',
			nome: '',
			nomeCurto: '',
			status: '',
			averbacao: '',
			dtInicial: '',
			dtFinal: '',
			enderecos: [],
			expediente: { de: '', ate: '' },
		},
		tipoEntidades: <TableValue[]>[],
		tipoEnderecos: <TableValue[]>[],
		loadingConsignantes: false,
		showEditor: false,
		showDeleteDialog: false,
		deleting: false,
		fetchingConsignante: false,
		error: '',
		saving: false,
	}),
	actions: {
		toggleEditor(show?: boolean, consignante?: Consignante) {
			this.editingConsignante = consignante ?? {
				consignanteMasterId: 0,
				tipoEntidadeId: 0,
				cnpj: '',
				nome: '',
				nomeCurto: '',
				status: '',
				averbacao: '',
				dtInicial: '',
				dtFinal: '',
				enderecos: [],
				expediente: { de: '', ate: '' },
			};
			if (consignante?.id && !consignante.enderecos.length) {
				this.fetchConsignante(consignante.id);
			}
			this.showEditor = show ?? !this.showEditor;
		},
		async fetchConsignante(id: number) {
			try {
				this.fetchingConsignante = true;
				const consignante = await consignanteRepository.getConsignanteById(id);
				const localConsignante = this.consignantes.find((e) => e.id === id);
				if (localConsignante && consignante) {
					localConsignante.enderecos.splice(0, localConsignante.enderecos.length);
					localConsignante.enderecos.push(...consignante.enderecos);
					this.editingConsignante.enderecos = localConsignante.enderecos;
				}
			} catch (error) {
				if (error instanceof BaseError) {
					Swal.fire({
						icon: 'error',
						title: 'Erro ao buscar os dados do consignante',
						text: error.message,
						showConfirmButton: false,
						timer: 1500,
					});
				}
			} finally {
				this.fetchingConsignante = false;
			}
		},
		async toggleStatus(consignante: Consignante) {
			this.saving = true;
			await this.fetchConsignante(consignante.id);
			this.updateEditingConsignante(consignante);
			this.updateEditingConsignante({ status: consignante.status === 'Ativado' ? 'Inativado' : 'Ativado' })
			this.editingConsignante.id = consignante.id;
			await this.saveConsignante();
		},
		updateEditingConsignante(consignante: Partial<Consignante>) {
			this.editingConsignante = {
				id: this.editingConsignante.id,
				consignanteMasterId: consignante.consignanteMasterId ?? this.editingConsignante.consignanteMasterId,
				tipoEntidadeId: consignante.tipoEntidadeId ?? this.editingConsignante.tipoEntidadeId,
				cnpj: consignante.cnpj ?? this.editingConsignante.cnpj,
				nome: consignante.nome ?? this.editingConsignante.nome,
				nomeCurto: consignante.nomeCurto ?? this.editingConsignante.nomeCurto,
				status: consignante.status ?? this.editingConsignante.status,
				averbacao: consignante.averbacao ?? this.editingConsignante.averbacao,
				dtInicial: consignante.dtInicial ?? this.editingConsignante.dtInicial,
				dtFinal: consignante.dtFinal ?? this.editingConsignante.dtFinal,
				enderecos: consignante.enderecos ?? this.editingConsignante.enderecos,
				expediente: consignante.expediente ?? this.editingConsignante.expediente,
			};
		},
		toggleDeleteConsignante(props?: {
			consignante?: Consignante,
			show?: boolean;
		}) {
			if (!props?.consignante) {
				this.showDeleteDialog = false;
				return;
			}
			this.editingConsignante = props?.consignante ?? this.editingConsignante;
			this.showDeleteDialog = props?.show ?? !this.showDeleteDialog;
		},
		async clearFilter() { },
		async getAllConsignantes(pagination?: PaginacaoArgs) {
			try {
				this.loadingConsignantes = true;
				const response = await consignanteRepository.getAllConsignantes({
					page: pagination?.page ?? this.pagination.page,
					limit: pagination?.limit ?? this.pagination.limite,
				});
				const tipoEntidadesResponse = await tabelasAuxiliaresRepository.getAllTableValues('tipo-entidade')
				const tipoEnderecosResponse = await tabelasAuxiliaresRepository.getAllTableValues('tipo-endereco')
				this.tipoEntidades = tipoEntidadesResponse;
				this.tipoEnderecos = tipoEnderecosResponse;
				this.consignantes = response.items;
				this.pagination.page = pagination?.page ?? this.pagination.page;
				this.pagination.total = response.total;
			} catch (e) {
				console.log('erro brabo', e);
			} finally {
				this.loadingConsignantes = false;
			}
		},
		async nextPage() {
			await this.getAllConsignantes({
				page: this.pagination.page++,
				limit: this.pagination.limite,
			});
		},
		async previousPage() {
			await this.getAllConsignantes({
				page: this.pagination.page--,
				limit: this.pagination.limite,
			});
		},
		async goToPage(page: number) {
			await this.getAllConsignantes({
				page,
				limit: this.pagination.limite,
			});
			this.pagination.page = page;
		},
		async setLimit(limit: number) {
			this.pagination.limite = limit;
			this.getAllConsignantes({
				limit: limit,
				page: this.pagination.page,
			});
		},
		validateForm() {
			let message = '';
			if (!this.editingConsignante.consignanteMasterId) {
				message = 'Selecione um consignante master.';
			}
			if (!this.editingConsignante.tipoEntidadeId) {
				message = 'Selecione um tipo de entidade.';
			}
			this.editingConsignante.enderecos.forEach((e) => {
				if (!e.tipoEnderecoId || !e.logradouro || !e.cep || !e.cidade.id || !e.cidade.estado?.id) {
					message = 'Endereço inválido.';
				}
			});
			if (!this.editingConsignante.enderecos.length) {
				message = 'Endereço inválido';
			}
			if (!this.editingConsignante.expediente.de || !this.editingConsignante.expediente.ate) {
				message = 'Expediente inválido.';
			}
			if (message) {
				Swal.fire({
					icon: 'error',
					title: 'Erro ao cadastrar consignante!',
					text: message,
					showConfirmButton: false,
					timer: 1500,
				});
				return false;
			}
			return true;
		},
		async saveConsignante() {
			try {
				if (!this.validateForm()) {
					return;
				}
				const consignante = this.editingConsignante;
				this.saving = true;
				this.error = '';
				if (consignante.id) {
					await consignanteRepository.updateConsignante({
						id: consignante.id!,
						...consignante,
					});
				} else {
					await consignanteRepository.createConsignante(consignante);
				}
				await this.getAllConsignantes();
				this.showEditor = false;
				Swal.fire({
					icon: 'success',
					title: 'Consignante Salvo!',
					showConfirmButton: false,
					timer: 1500,
				});
			} catch (error) {
				if (error instanceof BaseError) {
					Swal.fire({
						icon: 'error',
						title: 'Erro ao salvar consignante!',
						text: error.message,
						showConfirmButton: false,
						timer: 1500,
					});
				}
			} finally {
				this.saving = false;
			}
		},
		async deleteConsignante() {
			try {
				if (!this.editingConsignante?.id) {
					return;
				}
				this.deleting = true;
				await consignanteRepository.deleteConsignante(this.editingConsignante.id);
				await this.getAllConsignantes();
				this.showDeleteDialog = false;
				Swal.fire({
					icon: 'success',
					title: 'Consignante Apagado!',
					showConfirmButton: false,
					timer: 1500,
				});
			} catch (error) {
				if (error instanceof BaseError) {
					Swal.fire({
						icon: 'error',
						title: 'Erro ao apagar consignante!',
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
			return this.consignantes.find((e) => e.id == this.editingConsignante.id)?.enderecos.map((e) => ({
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