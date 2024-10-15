import { defineStore } from "pinia";
import { ConsignanteMasterRepository } from "../repositories/consignante_master.repository";
import { ConsignanteMaster } from "../types/consignante_master";
import { BaseError } from "src/core/errors/base.error";
import { PaginationArgs } from "src/core/types/pagination.type";

const consignanteMasterRepository = new ConsignanteMasterRepository();

export const consignanteMasterStore = defineStore('consignanteMaster', {
  state: () => ({
    consignantesMaster: <ConsignanteMaster[]>[],
    total: 0,
    page: 1,
    limit: 10,
    loadingConsignantesMaster: true,
    error: '',
  }),
  actions: {
    async getAllConsignantes(pagination?: PaginationArgs) {
      try {
        this.loadingConsignantesMaster = true;
        const response = await consignanteMasterRepository.getAllConsignantesMaster({
          page: pagination?.page ?? this.page,
          limit: pagination?.limit ?? this.limit,
        });
        this.consignantesMaster = response.items;
        this.page = pagination?.page ?? this.page;
        this.total = response.total;
      } catch (error) {
        console.error(error);
      } finally{
        this.loadingConsignantesMaster = false;
      }
    },
    async nextPage() {
      await this.getAllConsignantes({
        page: this.page++,
        limit: this.limit,
      });
    },
    async previousPage() {
      await this.getAllConsignantes({
        page: this.page--,
        limit: this.limit,
      })
    },
    async goToPage(page: number) {
      await this.getAllConsignantes({
        page,
        limit: this.limit,
      });
      this.page = page;
    },
    async setLimit(limit: number) {
      this.limit = limit;
      this.getAllConsignantes({
        limit: limit,
        page: this.page,
      });
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