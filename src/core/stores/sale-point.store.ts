import { defineStore } from "pinia";
import { SalePointRepository } from "@/core/repositories";

export const salePointRepository = new SalePointRepository();

export const salePointStore = defineStore('sale-point-store', {
	state: () => ({}),
	actions: {},
	getters: {},
});