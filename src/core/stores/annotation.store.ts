import { defineStore } from "pinia";
import { AnnotationRepository } from "@/core/repositories";

export const annotationRepository = new AnnotationRepository()

export const annotationStores = defineStore('annotation-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});