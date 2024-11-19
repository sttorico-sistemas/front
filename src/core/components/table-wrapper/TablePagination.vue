<template>
  <pagination
    v-slot="{ page }"
    v-model:page="currentPage"
    :total="totalItens"
    :items-per-page="itemsPerPage"
    :sibling-count="1"
    show-edges
    :default-page="1"
    class="mt-4"
    @update:page="handlePaginate"
  >
    <pagination-list v-slot="{ items }" class="flex items-center gap-1">
      <pagination-first />
      <pagination-prev />

      <template v-for="(item, index) in items">
        <pagination-listItem
          v-if="item.type === 'page'"
          :key="index"
          :value="item.value"
          as-child
          :disabled="disabled"
        >
          <button-root
            class="h-10 w-10 p-0"
            :variant="item.value === page ? 'default' : 'outline'"
            type="button"
          >
            {{ item.value }}
          </button-root>
        </pagination-listItem>
        <pagination-ellipsis v-else :key="item.type" :index="index" />
      </template>

      <pagination-Next />
      <pagination-Last />
    </pagination-list>
  </pagination>
</template>

<script setup lang="ts">
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/core/components/pagination'
import { ButtonRoot } from '../button';

const currentPage = defineModel({ type: Number })
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  totalItens: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
})
const emit = defineEmits(['update-paginate'])

function handlePaginate(page: number) {
  emit('update-paginate', page)
}
</script>
