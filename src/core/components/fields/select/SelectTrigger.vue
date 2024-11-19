<script setup lang="ts">
import {
  SelectIcon,
  SelectTrigger,
  type SelectTriggerProps,
  useForwardProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { cn } from '@/core/utils';

const props = defineProps<
  SelectTriggerProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProperties = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProperties)
</script>

<template>
  <select-trigger
    v-bind="forwardedProps"
    :class="
      cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        props.class,
      )
    "
  >
    <slot />
    <select-icon as-child>
      <font-awesome-icon :icon="['fas', 'chevron-down']" />
    </select-icon>
  </select-trigger>
</template>
