import { defineStore } from "pinia";
import { ConsignanteMasterRepository } from "../repositories/consignante_master.repository";
import { ConsignanteMaster } from "../types/consignante_master";
import { BaseError } from "src/core/errors/base.error";
import { PaginationArgs } from "src/core/types/pagination.type";

const consignanteMasterRepository = new ConsignanteMasterRepository();

export const consignanteMasterStore = defineStore('consignanteMaster', {
  state: () => ({
    consignantesMaster: <ConsignanteMaster[]>[],
    pagination: {
      limit: 10,
      page: 1,
      total: 0,
    },
    // TODO está carregando todos para o filtro funcionar. Buscar alternativas.
    consignantesFilter: <string[]>[],
    filter: '',
    loadingConsignantesMaster: true,
    error: '',
  }),
  actions: {
    async applyFilter(query: string) {
      this.filter = query;
      await this.getAllConsignantes({
        limit: this.pagination.limit,
        page: 1,
      }, query,);
    },
    async clearFilter() {
      this.filter = '';
      await this.getAllConsignantes(this.pagination);
    },
    async getAllConsignantes(pagination?: PaginationArgs, query?: string) {
      try {
        this.loadingConsignantesMaster = true;
        const response = await consignanteMasterRepository.getAllConsignantesMaster({
          page: pagination?.page ?? this.pagination.page,
          limit: pagination?.limit ?? this.pagination.limit,
        },
          query,
        );
        this.consignantesMaster = response.items;
        this.pagination.page = pagination?.page ?? this.pagination.page;
        this.pagination.total = response.total;
        if (!this.filter) {
          const filterResponse = await consignanteMasterRepository.getAllConsignantesMaster({
            page: 1,
            limit: response.total,
          });
          this.consignantesFilter = filterResponse.items.map((e) => e.nome);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loadingConsignantesMaster = false;
      }
    },
    async nextPage() {
      await this.getAllConsignantes({
        page: this.pagination.page++,
        limit: this.pagination.limit,
      });
    },
    async previousPage() {
      await this.getAllConsignantes({
        page: this.pagination.page--,
        limit: this.pagination.limit,
      })
    },
    async goToPage(page: number) {
      await this.getAllConsignantes({
        page,
        limit: this.pagination.limit,
      });
      this.pagination.page = page;
    },
    async setLimit(limit: number) {
      this.pagination.limit = limit;
      this.getAllConsignantes({
        limit: limit,
        page: this.pagination.page,
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
  getters: {
    page(): number {
      if (this.filter) {
        return 1;
      }
      return this.pagination.page;
    },
    limit(): number {
      return this.pagination.limit;
    },
    total(): number {
      return this.pagination.total;
    }
  },
});