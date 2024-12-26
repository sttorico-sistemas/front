import { defineStore } from "pinia";
import { InstructionOfProcedureRepository } from "@/core/repositories";

export const instructionOfProcedureRepository = new InstructionOfProcedureRepository()

export const instructionOfProcedureStores = defineStore('instruction-of-procedure-stores', {
	state: () => ({}),
	actions: {},
	getters: {},
});