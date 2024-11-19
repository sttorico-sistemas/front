<script setup lang="ts">
import {
  RadioGroupIndicator,
  RadioGroupItem,
  type RadioGroupItemProps,
  useForwardProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/core/utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps<
  RadioGroupItemProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProperties = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProperties)
</script>

<template>
  <radio-group-item
    v-bind="forwardedProps"
    :class="
      cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  >
    <radio-group-indicator class="flex items-center justify-center">
      <font-awesome-icon :icon="['far', 'circle']" class="fill-current text-current" />
    </radio-group-indicator>
  </radio-group-item>
</template>
