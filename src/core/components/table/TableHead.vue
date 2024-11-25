<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/core/utils';

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <th
    :class="
      cn(
        'h-12 px-4 text-left align-middle font-bold text-muted-foreground text-primary_3-table [&:has([role=checkbox])]:pr-0',
        props.class,
      )
    "
  >
    <slot />
  </th>
</template>
