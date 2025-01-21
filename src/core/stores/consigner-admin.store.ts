import { defineStore } from "pinia";
import { ConsignerAdminRepository } from "@/core/repositories";

export const consignerAdminRepository = new ConsignerAdminRepository()

export const consignerAdminStores = defineStore('consigner-admin-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});