<script setup lang="ts">
import {
  SelectItem,
  SelectItemIndicator,
  type SelectItemProps,
  SelectItemText,
  useForwardProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/core/utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps<
  SelectItemProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProperties = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProperties)
</script>

<template>
  <select-item
    v-bind="forwardedProps"
    :class="
      cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class,
      )
    "
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <select-item-indicator>
        <font-awesome-icon :icon="['fas', 'check']" />
      </select-item-indicator>
    </span>

    <select-item-text>
      <slot />
    </select-item-text>
  </select-item>
</template>
