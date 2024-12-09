import { defineStore } from "pinia";
import { AuxiliaryRepository } from "@/core/repositories";

export const auxiliaryRepository = new AuxiliaryRepository();

export const auxiliaryStore = defineStore('auxiliary-store', {
	state: () => ({}),
	actions: {},
	getters: {},
});