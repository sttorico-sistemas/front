import { defineStore } from "pinia";
import { TableValue } from "../types/table_value.d";
import { Table } from "../types/table";
import { TabelasAuxiliaresRepository } from "../repositories/tabelas_auxiliares.repository";

const tabelasAuxiliaresRepository = new TabelasAuxiliaresRepository();

export const tabelasAuxiliaresStore = defineStore('tabelasAuxiliares', {
  state: () => ({
    selectedTable: 'tipos_contrato',
    tables: <Table[]>[
      {
        id: 'tipos_contrato',
        name: 'Tipos de Contrato',
      },
      {
        id: 'tipos_endereco',
        name: 'Tipos de Endereço'
      },
      {
        id: 'tipos_entidade',
        name: 'Tipos de Entidade',
      },
    ],
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
    editingType: 'tipos_contrato',
    saving: false,
  }),
  actions: {
    async getValues() {
      this.loadingData = true;
      const values = await tabelasAuxiliaresRepository.getAllTableValues(this.selectedTable);
      this.values = values;
      this.loadingData = false;
    },
    async setSelectedTable(id: string) {
      if (typeof id === 'string') {
        this.selectedTable = this.tables.find((e) => e.name === id)?.id ?? 'tipos_contrato';
      } else {
        this.selectedTable = id;
      }
      await this.getValues();
    },
    toggleEditor(show?: boolean) {
      this.editingTableValue.value = '';
      this.editingType = this.selectedTable;
      this.showEditor = show ?? !this.showEditor;
    },
    updateEditingName(value: string) {
      this.editingTableValue.value = value;
    },
    updateEditingType(value: string) {
      this.editingType = this.tables.find((e) => e.name === value)?.id ?? 'tipos_contrato';;
    },
    async saveType() {
      if (!this.editingTableValue.value) {
        this.error = 'Este campo é obrigatório.'
        return;
      }
      this.error = '';
      this.saving = true;
      await tabelasAuxiliaresRepository.createTableValue({
        id: 1,
        tableId: this.tables.find((e) => e.name === this.editingType)?.id ?? 'tipos_contrato',
        value: this.editingTableValue.value,
      })
      await this.getValues();
      this.saving = false;
      this.selectedTable = this.editingType;
      this.showEditor = false;
    }
  }
});