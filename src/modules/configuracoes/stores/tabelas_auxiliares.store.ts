import { defineStore } from "pinia";
import { TableValue } from "../types/table_value.d";
import { Table, TableURL } from "../types/table";
import { TabelasAuxiliaresRepository } from "../repositories/tabelas_auxiliares.repository";
import { BaseError } from "src/core/errors/base.error";

const tabelasAuxiliaresRepository = new TabelasAuxiliaresRepository();

export const tabelasAuxiliaresStore = defineStore('tabelasAuxiliares', {
  state: () => ({
    selectedTable: '',
    tables: <Table[]>[],
    error: '',
    values: <TableValue[]>[],
    showEditor: false,
    loadingData: true,
    editingTableValue: <{
      id?: number;
      value: string;
    }>{
        value: '',
      },
    editingType: '',
    saving: false,
  }),
  actions: {
    async getTables() {
      this.loadingData = true;
      const tables = await tabelasAuxiliaresRepository.getAllTables();
      this.tables = tables;
      this.selectedTable = tables[0]?.url;
      this.loadingData = false;
      await this.getValues();
    },
    async getValues(tableId?: TableURL) {
      this.loadingData = true;
      const values = await tabelasAuxiliaresRepository.getAllTableValues(tableId ?? this.selectedTable);
      this.values = values;
      this.loadingData = false;
      // TODO remover dados mockados
      if (!values.length) {
        if (tableId === 'tipo-endereco')
          return [
            {
              id: 1,
              nome: 'Apartamento',
              tableUrl: tableId,
            },
            {
              id: 2,
              nome: 'Estabelecimento',
              tableUrl: tableId,
            }
          ];
        return [
          {
            id: 1,
            nome: 'WhatsApp',
            tableUrl: tableId,
          },
          {
            id: 2,
            nome: 'Transmissão',
            tableUrl: tableId,
          }
        ]
      }
      return values;
    },
    async setSelectedTable(url: string) {
      if (typeof url === 'string') {
        this.selectedTable = this.tables.find((e) => e.name === url)?.url ?? 'tipo-entidade';
      } else {
        this.selectedTable = url;
      }
      await this.getValues();
    },
    toggleEditor(show?: boolean, id?: number) {
      this.editingTableValue.value = '';
      this.editingType = this.selectedTable;
      if (id) {
        const value = this.values.find((e) => e.id === id)?.nome;
        if (value) {
          this.editingTableValue.id = id;
          this.editingTableValue.value = value;
        }
      }
      this.showEditor = show ?? !this.showEditor;
    },
    updateEditingName(value: string) {
      this.editingTableValue.value = value;
    },
    updateEditingType(value: string) {
      this.editingType = this.tables.find((e) => e.name === value)?.url ?? 'tipo-entidade';;
    },
    async saveType() {
      try {
        if (!this.editingTableValue.value) {
          this.error = 'Este campo é obrigatório.'
          return;
        }
        this.error = '';
        this.saving = true;
        if (this.editingTableValue.id) {
          await tabelasAuxiliaresRepository.updateTableValue({
            id: this.editingTableValue.id,
            tableUrl: this.editingType,
            nome: this.editingTableValue.value,
          });
        } else {
          await tabelasAuxiliaresRepository.createTableValue({
            id: 1,
            tableUrl: this.editingType,
            nome: this.editingTableValue.value,
          })
        }
        this.selectedTable = this.editingType;
        await this.getValues();
        this.showEditor = false;
      } catch (error) {
        if (error instanceof BaseError) {
          this.error = error.message;
        }
      } finally {
        this.saving = false;
      }
    }
  }
});