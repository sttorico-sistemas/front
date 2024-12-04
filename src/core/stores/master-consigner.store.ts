import { defineStore } from "pinia";
import { MasterConsignerRepository } from "@/core/repositories";

export const masterConsignerRepository = new MasterConsignerRepository()

export const masterConsignerStores = defineStore('master-consigner-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});