import { defineStore } from "pinia";
import { useAxios } from "src/core/composables/use_axios";

const http = useAxios();

export const locationStore = defineStore('locationStore', {
  state: () => ({
    states: <string[]>[],
    cities: <string[]>[],
  }),
  actions: {
    async getStates() {
      const response = await http.get('/estados');
      const states = response.data.data.map((e: Record<string, any>) => e.nome)
      this.states = states;
    }
  }
});