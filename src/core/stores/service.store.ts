import { defineStore } from "pinia";
import { ServiceRepository } from "@/core/repositories";

export const serviceRepository = new ServiceRepository()

export const serviceStores = defineStore('service-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});