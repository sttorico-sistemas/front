import { defineStore } from "pinia";
import { FileRepository } from "@/core/repositories";

export const fileRepository = new FileRepository()

export const fileStores = defineStore('file-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});