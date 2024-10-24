import { defineStore } from "pinia";
import { LocationState, StateCities } from "../types/location_state.d";
import { LocationRepository } from "../repositories/location.repository";

const locationRepository = new LocationRepository()

export const locationStore = defineStore('locationStore', {
  state: () => ({
    states: <LocationState[]>[],
    cities: <StateCities>{},
  }),
  actions: {
    async getStates(): Promise<LocationState[]> {
      if (!this.states.length) {
        const states = await locationRepository.getStates();
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
      const cities = await locationRepository.getStateCities(stateId);
      this.cities[state.uf] = cities;
    }
  }
});