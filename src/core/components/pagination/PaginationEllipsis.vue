<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { PaginationEllipsis, type PaginationEllipsisProps } from 'radix-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { cn } from '@/core/utils';

const props = defineProps<PaginationEllipsisProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <pagination-ellipsis v-bind="delegatedProps" :class="cn('w-9 h-9 flex items-center justify-center', props.class)">
    <slot>
      <font-awesome-icon :icon="['fas', 'ellipsis']" />
    </slot>
  </pagination-ellipsis>
</template>
