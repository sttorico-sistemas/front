import { defineStore } from "pinia";
import { EndorserRepository } from "@/core/repositories";

export const endorserRepository = new EndorserRepository()

export const endorserStores = defineStore('endorser-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});