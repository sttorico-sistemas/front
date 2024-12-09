import { defineStore } from "pinia";
import { ConsignerRepository } from "@/core/repositories";

export const consignerRepository = new ConsignerRepository()

export const consignerStores = defineStore('master-consigner-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});