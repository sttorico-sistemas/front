import { defineStore } from "pinia";
import { ConsignanteMasterRepository } from "../repositories/consignante_master.repository";
import { ConsignanteMaster } from "../types/consignante_master";
import { BaseError } from "src/core/errors/base.error";

const consignanteMasterRepository = new ConsignanteMasterRepository();

export const consignanteMasterStore = defineStore('consignanteMaster', {
  state: () => ({
    consignantesMaster: <ConsignanteMaster[]>[],
    error: '',
  }),
  actions: {
    async getAllConsignantes() {
      try {
        const response = await consignanteMasterRepository.getAllConsignantesMaster();
        this.consignantesMaster = response;
      } catch (error) {
        console.error(error);
      }
    },
    async createConsignanteMaster(name: string) {
      try {
        await consignanteMasterRepository.createConsignanteMaster({
          name,
        });
        await this.getAllConsignantes();
      } catch (error) {
        if (error instanceof BaseError) {
          this.error = error.message;
        }
      }
    },
    async updateConsignanteMaster(data: {
      id: number;
      name: string;
    }) {
      try {
        await consignanteMasterRepository.updateConsignanteMaster({
          id: data.id,
          nome: data.name,
        });
        await this.getAllConsignantes();
      } catch (error) {
        if (error instanceof BaseError) {
          this.error = error.message;
        }
      }
    },
    clearError() {
      this.error = '';
    }
  },
});