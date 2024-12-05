import { defineStore } from "pinia";
import { GeneralRepository } from "@/core/repositories";

export type PageLinks = {
	id: number
	name: string
	url: string
}

export type PageData = {
	id: number
	name: string
	slug: string
	children: PageLinks
}

export const generalRepository = new GeneralRepository()

export const generalStores = defineStore('general-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});