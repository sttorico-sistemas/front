<script setup lang="ts">
import {
  RadioGroupRoot,
  type RadioGroupRootEmits,
  type RadioGroupRootProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/core/utils';

const props = defineProps<
  RadioGroupRootProps & { class?: HTMLAttributes['class'] }
>()
const emits = defineEmits<RadioGroupRootEmits>()

const delegatedProperties = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProperties, emits)
</script>

<template>
  <radio-group-root :class="cn('grid gap-2', props.class)" v-bind="forwarded">
    <slot />
  </radio-group-root>
</template>
