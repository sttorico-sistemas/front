import { defineStore } from "pinia";
import { TableValue } from "../types/table_value.d";
import { Table } from "../types/table";
import { TabelasAuxiliaresRepository } from "../repositories/tabelas_auxiliares.repository";

const tabelasAuxiliaresRepository = new TabelasAuxiliaresRepository();

export const tabelasAuxiliaresStore = defineStore('tabelasAuxiliares', {
  state: () => ({
    selectedTable: 1,
    tables: <Table[]>[
      {
        id: 1,
        name: 'Tipos de Contrato',
      },
      {
        id: 2,
        name: 'Tipos de Endereço'
      },
      {
        id: 3,
        name: 'Tipos de Entidade',
      },
    ],
    values: <TableValue[]>[],
    showEditor: false,
    editingTypeName: '',
    saving: false,
  }),
  actions: {
    async getValues() {
      const values = await tabelasAuxiliaresRepository.getAllTableValues(this.selectedTable);
      this.values = values;
    },
    async setSelectedTable(id: number | string) {
      console.log(id);
      if (typeof id === 'string') {
        this.selectedTable = this.tables.find((e) => e.name === id)?.id ?? 1;
      } else {
        this.selectedTable = id;
      }
      await this.getValues();
    },
    toggleEditor(show?: boolean) {
      this.editingTypeName = '';
      this.showEditor = show ?? !this.showEditor;
    },
    updateEditingName(value: string) {
      console.log(value);
      this.editingTypeName = value;
    }
  }
});