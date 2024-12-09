<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/core/utils';

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <td
    :class="
      cn('p-2 align-middle max-w-[400px] [&:has([role=checkbox])]:pr-0', props.class)
    "
  >
    <slot />
  </td>
</template>
