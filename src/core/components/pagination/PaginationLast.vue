<script setup lang="ts">
import { PaginationLast, type PaginationLastProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { cn } from '@/core/utils';
import { ButtonRoot } from '../button';

const props = withDefaults(
  defineProps<PaginationLastProps & { class?: HTMLAttributes['class'] }>(),
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
  <pagination-last v-bind="delegatedProps">
    <button-root
      type="button"
      :class="cn('h-10 w-10 p-0 rounded-full', props.class)"
      variant="outline"
    >
      <slot>
        <font-awesome-icon :icon="['fas', 'angles-right']" />
      </slot>
    </button-root>
  </pagination-last>
</template>
