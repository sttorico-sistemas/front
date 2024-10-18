import { TableValue } from "../types/table_value.d";

export class TabelasAuxiliaresRepository {
  async createTableValue(tableValue: TableValue): Promise<TableValue> {
    const storageKey = `table.${tableValue.tableId}`;

    const currentValues = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as TableValue[];
    currentValues.unshift(tableValue);
    localStorage.setItem(storageKey, JSON.stringify(currentValues));
    return tableValue;
  }

  async deleteTableValue(tableId: string, valueId: number): Promise<void> {
    const storageKey = `table.${tableId}`;
    const currentValues = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as TableValue[];

    const updatedValues = currentValues.filter((item) => item.id !== valueId);
    localStorage.setItem(storageKey, JSON.stringify(updatedValues));
  }

  async updateTableValue(tableValue: TableValue): Promise<TableValue | null> {
    const storageKey = `table.${tableValue.tableId}`;
    const currentValues = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as TableValue[];

    const index = currentValues.findIndex((item) => item.id === tableValue.id);
    if (index !== -1) {
      currentValues[index] = tableValue;
      localStorage.setItem(storageKey, JSON.stringify(currentValues));
      return tableValue;
    }

    return null;
  }

  async getAllTableValues(tableId: string): Promise<TableValue[]> {
    const storageKey = `table.${tableId}`;
    const currentValues = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as TableValue[];
    return currentValues;
  }
}
