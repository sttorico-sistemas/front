<script setup lang="ts">
import { FlexRender, type Table as TableType } from '@tanstack/vue-table'

import {
	TableRoot,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/core/components/table'
import { Skeleton } from '@/core/components/skeleton'
import { PropType } from 'vue';

defineProps({
	table: { type: Object as PropType<TableType<any>>, required: true },
	columnSize: { type: Number, required: true },
	rowLimit: { type: Number, required: false, default: () => 10 },
	isLoading: { type: Boolean, default: false },
})
</script>

<template>
	<table-root class="w-full">
		<table-header>
			<table-row v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
				<table-head v-for="header in headerGroup.headers" :key="header.id">
					<flex-render v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
						:props="header.getContext()" />
				</table-head>
			</table-row>
		</table-header>
		<table-body>
			<template v-if="isLoading">
				<table-row v-for="_row in Array.from({ length: rowLimit })" :key="`row-skeleton-${_row}`">
					<table-cell v-for="_cell in Array.from({ length: columnSize })" :key="`cell-skeleton-${_cell}`">
						<skeleton class="h-5 w-full" />
					</table-cell>
				</table-row>
			</template>

			<template v-else-if="table.getRowModel().rows?.length">
				<table-row v-for="row in table.getRowModel().rows" :key="row.id" :data-state="row.getIsSelected() && 'selected'"
					:class="[(row.index + 1) % 2 === 1 ? 'bg-muted/30' : undefined]">
					<table-cell v-for="cell in row.getVisibleCells()" :key="cell.id">
						<flex-render :render="cell.column.columnDef.cell" :props="cell.getContext()" />
					</table-cell>
				</table-row>
			</template>

			<template v-else>
				<table-row>
					<table-cell :colspan="columnSize" class="h-24 text-center text-muted-foreground">
						Sem resultado.
					</table-cell>
				</table-row>
			</template>
		</table-body>
	</table-root>
</template>
