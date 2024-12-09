import { defineStore } from "pinia";
import { PersonRepository } from "@/core/repositories";

export const personRepository = new PersonRepository()

export const personStores = defineStore('person-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});