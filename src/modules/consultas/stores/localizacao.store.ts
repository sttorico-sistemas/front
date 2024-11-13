import { defineStore } from "pinia";
import { Estado, EstadoCidades } from "../types/estado.d";
import { LocalizacaoRepository } from "../repositories/localizacao.repository";

const localizacaoRepository = new LocalizacaoRepository()

export const localizacaoStore = defineStore('locationStore', {
	state: () => ({
		states: <Estado[]>[],
		cities: <EstadoCidades>{},
	}),
	actions: {
		async getStates(): Promise<Estado[]> {
			if (!this.states.length) {
				const states = await localizacaoRepository.getEstados();
				this.states = states;
			}
			return this.states;
		},
		async getStateCitites(stateId: number): Promise<void> {
			const state = this.states.find((e) => e.id === stateId);
			if (!state) {
				return;
			}
			if (this.cities[state.uf]?.length) {
				return;
			}
			const cities = await localizacaoRepository.getEstadoCidades(stateId);
			this.cities[state.uf] = cities;
		}
	}
});