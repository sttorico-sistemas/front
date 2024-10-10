import { defineStore } from "pinia";
import { ConsignanteMasterRepository } from "../repositories/consignante_master.repository";
import { ConsignanteMaster } from "../types/consignante_master";

const consignanteMasterRepository = new ConsignanteMasterRepository();

export const consignanteMasterStore = defineStore('consignanteMaster', {
  state: () => ({
    consignantesMaster: <ConsignanteMaster[]>[],
  }),
  actions: {
    async getAllConsignantes() {
      const response = await consignanteMasterRepository.getAllConsignantesMaster();
      this.consignantesMaster = response;
    }
  },
});