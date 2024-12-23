import { defineStore } from "pinia";
import { RegulatoryRepository } from "@/core/repositories";

export const regulatoryRepository = new RegulatoryRepository()

export const regulatoryStores = defineStore('regulatory-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});