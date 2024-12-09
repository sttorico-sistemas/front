import { defineStore } from "pinia";
import { IAMRepository } from "@/core/repositories";

export const iamRepository = new IAMRepository()

export const iamStores = defineStore('iam-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});