import { defineStore } from "pinia";
import { LogRepository } from "@/core/repositories";

export const logRepository = new LogRepository()

export const logStores = defineStore('log-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});