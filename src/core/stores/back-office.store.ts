import { defineStore } from "pinia";
import { BackOfficeRepository } from "@/core/repositories";

export const backOfficeRepository = new BackOfficeRepository();

export const backOfficeStore = defineStore('back-office-store', {
	state: () => ({}),
	actions: {},
	getters: {},
});