import { defineStore } from "pinia";

export const consignanteStore = defineStore('consignanteStore', {
	state: () => ({
		showEditor: false,
	})
});