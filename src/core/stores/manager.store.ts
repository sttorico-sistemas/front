import { defineStore } from "pinia";
import { ManagerRepository } from "@/core/repositories";

export const managerRepository = new ManagerRepository()

export const managerStores = defineStore('manager-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});