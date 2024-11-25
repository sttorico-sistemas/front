<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/core/utils';

import TableCell from './TableCell.vue'
import TableRow from './TableRow.vue'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    colspan?: number
  }>(),
  {
    colspan: 1,
  },
)

const delegatedprops = computed(() => {
  const { class: _class, ...delegated } = props

  return { delegated, _class }
})
</script>

<template>
  <TableRow>
    <TableCell
      :class="
        cn(
          'whitespace-nowrap p-4 align-middle text-sm text-foreground',
          delegatedprops._class,
        )
      "
      v-bind="delegatedprops.delegated"
    >
      <div class="flex items-center justify-center py-10">
        <slot />
      </div>
    </TableCell>
  </TableRow>
</template>
