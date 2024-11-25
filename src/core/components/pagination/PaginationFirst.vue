<script setup lang="ts">
import { PaginationFirst, type PaginationFirstProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { cn } from '@/core/utils';
import { ButtonRoot } from '../button';

const props = withDefaults(
  defineProps<PaginationFirstProps & { class?: HTMLAttributes['class'] }>(),
  {
    asChild: true,
  },
)

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <pagination-first v-bind="delegatedProps">
    <button-root
      type="button"
      :class="cn('h-10 w-10 p-0 rounded-full', props.class)"
      variant="outline"
    >
      <slot>
        <font-awesome-icon :icon="['fas', 'angles-left']" />
      </slot>
    </button-root>
  </pagination-first>
</template>
