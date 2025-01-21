import { defineStore } from "pinia";
import { ConsignorRepository } from "@/core/repositories";

export const consignorRepository = new ConsignorRepository()

export const consignorStores = defineStore('consignor-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});