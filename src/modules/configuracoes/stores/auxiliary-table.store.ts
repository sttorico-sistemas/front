import { defineStore } from "pinia";
import { TableValue } from "../types/table_value.d";
import { Table, TableURL } from "../types/table";
import { TabelasAuxiliaresRepository } from "../repositories/tabelas_auxiliares.repository";
import { BaseError } from "src/core/errors/base.error";
import Swal from "sweetalert2";

export const tabelasAuxiliaresRepository = new TabelasAuxiliaresRepository();

export const tabelasAuxiliaresStore = defineStore('tabelasAuxiliares', {
  state: () => ({
    selectedTable: '',
    tables: <Table[]>[],
    error: '',
    values: <TableValue[]>[],
    showEditor: false,
    showDeleteDialog: false,
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
      const tables = await tabelasAuxiliaresRepository.getAllTables({});
      this.tables = tables;
      this.selectedTable = tables[0]?.url;
      if (this.selectedTable) {
        return await this.getValues();
      }
      this.loadingData = false;
      Swal.fire({
        icon: 'error',
        title: 'Nenhum tipo cadastrado.',
        showConfirmButton: false,
        timer: 1500,
      })
    },
    async getValues(tableId?: TableURL) {
      this.loadingData = true;
      const values = await tabelasAuxiliaresRepository.getAllTableValues(tableId ?? this.selectedTable);
      this.values = values;
      this.loadingData = false;
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
    toggleDeleteDialog(show?: boolean, id?: number) {
      this.editingTableValue.value = '';
      this.editingType = this.selectedTable;
      if (id) {
        const value = this.values.find((e) => e.id === id)?.nome;
        if (value) {
          this.editingTableValue.id = id;
          this.editingTableValue.value = value;
        }
      }
      this.showDeleteDialog = show ?? !this.showDeleteDialog;
    },
    updateEditingName(value: string) {
      this.editingTableValue.value = value;
    },
    updateEditingType(value: string) {
      this.editingType = this.tables.find((e) => e.name === value)?.url ?? 'tipo-entidade';;
    },
    async deleteType() {
      try {
        if (!this.editingTableValue.id) {
          return;
        }
        this.saving = true;
        await tabelasAuxiliaresRepository.deleteTableValue(this.editingType, this.editingTableValue.id);
        await this.getValues();
        this.showDeleteDialog = false;
        Swal.fire({
          icon: 'success',
          title: 'Configuração Apagada!',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        if (error instanceof BaseError) {
          this.error = error.message;
        }
      } finally {
        this.saving = false;
      }
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
        Swal.fire({
          icon: 'success',
          title: 'Configuração Salva!',
          showConfirmButton: false,
          timer: 1500,
        });
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