import { defineStore } from "pinia";
import { OperatorRepository } from "@/core/repositories";

export const operatorRepository = new OperatorRepository()

export const operatorStores = defineStore('operator-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});