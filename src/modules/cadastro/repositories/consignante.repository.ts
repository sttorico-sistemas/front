import { ConsignanteModel } from "../models/consignante.model";
import { BaseError } from "src/core/errors/base.error";
import { PaginatedResultOutput, PaginacaoArgs } from "src/core/types/paginacao.type.d";
import { Consignante } from "../types/consignante";

export class ConsignanteRepository {
	private localStorageKey = 'consignantes';


	private getConsignanteModel(consignante: Partial<Pick<Consignante, 'id'>> & Omit<Consignante, 'id'>): ConsignanteModel {
		return new ConsignanteModel({
			id: consignante.id ?? 0,
			consignanteMasterId: consignante.consignanteMasterId,
			tipoEntidadeId: consignante.tipoEntidadeId,
			cnpj: consignante.cnpj,
			nome: consignante.nome,
			nomeCurto: consignante.nomeCurto,
			status: consignante.status,
			averbacao: consignante.averbacao,
			dtInicial: consignante.dtInicial,
			dtFinal: consignante.dtFinal,
			enderecos: consignante.enderecos,
			expediente: consignante.expediente,
		});
	}
	private getConsignantesFromLocalStorage(): Record<string, any>[] {
		const data = localStorage.getItem(this.localStorageKey);
		if (data) {
			return JSON.parse(data);
		}
		return [];
	}

	private saveConsignantesToLocalStorage(consignantes: Record<string, any>[]): void {
		localStorage.setItem(this.localStorageKey, JSON.stringify(consignantes));
	}

	async getAllConsignantes(pagination?: PaginacaoArgs, query?: string): Promise<PaginatedResultOutput<Consignante>> {
		try {
			const consignantes = this.getConsignantesFromLocalStorage();

			// Simulação de pesquisa
			const filteredConsignantes = query
				? consignantes.filter(consignante => consignante.nome.toLowerCase().includes(query.toLowerCase()))
				: consignantes;

			// Simulação de paginação
			const startIndex = (pagination?.page ?? 1 - 1) * (pagination?.limit ?? 10);
			const endIndex = startIndex + (pagination?.limit ?? 10);
			const paginatedConsignantes = filteredConsignantes.slice(startIndex, endIndex);
			console.log('consiganantes', filteredConsignantes);

			return {
				total: filteredConsignantes.length,
				items: (paginatedConsignantes.length ? paginatedConsignantes : filteredConsignantes).map((e) => ConsignanteModel.fromRecord(e)),
			};
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async updateConsignante(consignante: Consignante): Promise<void> {
		try {
			const consignantes = this.getConsignantesFromLocalStorage();
			const index = consignantes.findIndex(c => c.id === consignante.id);
			if (index > -1) {
				consignantes[index] = consignante;
				this.saveConsignantesToLocalStorage(consignantes);
			} else {
				throw new Error("Consignante não encontrado");
			}
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async createConsignante(data: Partial<Pick<Consignante, 'id'>> & Omit<Consignante, 'id'>): Promise<void> {
		try {
			const consignantes = this.getConsignantesFromLocalStorage();
			const maxId = consignantes.reduce((max, consignante) => Math.max(max, consignante.id), 0);
			data.id = maxId;
			consignantes.push(this.getConsignanteModel(data).toRecord());
			this.saveConsignantesToLocalStorage(consignantes);
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async getConsignanteById(id: number): Promise<Consignante | undefined> {
		try {
			const consignantes = this.getConsignantesFromLocalStorage();
			const consignante = consignantes.find(c => c.id === id);
			if (!consignante) {
				throw new BaseError({
					code: 404,
					errors: {},
					message: 'Consigante não encontrado.'
				});
			}
			return ConsignanteModel.fromRecord(consignante);
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}

	async deleteConsignante(id: number): Promise<void> {
		try {
			const consignantes = this.getConsignantesFromLocalStorage();
			const index = consignantes.findIndex(c => c.id === id);
			if (index > -1) {
				consignantes.splice(index, 1);
				this.saveConsignantesToLocalStorage(consignantes);
			} else {
				throw new Error("Consignante não encontrado");
			}
		} catch (error) {
			throw BaseError.fromHttpError(error);
		}
	}
}