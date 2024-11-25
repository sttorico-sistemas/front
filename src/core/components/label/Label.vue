<script setup lang="ts">
import { Label as RadixLabel, type LabelProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/core/utils';

const props = defineProps<
  LabelProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProperties = computed(() => {
  const { class: classStyles, ...delegated } = props

  return { delegated, class: classStyles }
})
</script>

<template>
  <radix-label
    v-bind="delegatedProperties.delegated"
    :class="
      cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        delegatedProperties.class,
      )
    "
  >
    <slot />
  </radix-label>
</template>
