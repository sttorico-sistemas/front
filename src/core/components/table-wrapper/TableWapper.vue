<script setup lang="ts">
import { FlexRender, type Table as TableType } from '@tanstack/vue-table'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  TableRoot,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/components/table'
import { PropType } from 'vue';

defineProps({
  table: { type: Object as PropType<TableType<any>>, required: true },
  columnSize: { type: Number, required: true },
  isLoading: { type: Boolean, default: false },
})
</script>

<template>
  <table-root class="w-full">
    <table-header>
      <table-row
        v-for="headerGroup in table.getHeaderGroups()"
        :key="headerGroup.id"
      >
        <table-head v-for="header in headerGroup.headers" :key="header.id">
          <flex-render
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
        </table-head>
      </table-row>
    </table-header>
    <table-body>
      <template v-if="table.getRowModel().rows?.length">
        <table-row
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          :data-state="row.getIsSelected() && 'selected'"
        >
          <table-cell v-for="cell in row.getVisibleCells()" :key="cell.id">
            <flex-render
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
          </table-cell>
        </table-row>
      </template>

      <table-row v-else class="w-full">
        <table-cell
          v-if="isLoading"
          :colspan="columnSize"
          class="h-24 text-center text-muted-foreground"
        >
          <font-awesome-icon :icon="['fas', 'spinner']"
            class="mx-auto h-10 w-10 animate-spin text-highlighter-foreground"
          />
        </table-cell>

        <table-cell
          v-else
          :colspan="columnSize"
          class="h-24 text-center text-muted-foreground"
        >
          Sem resultado.
        </table-cell>
      </table-row>
    </table-body>
  </table-root>
</template>


