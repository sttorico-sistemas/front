<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { SelectScrollUpButton, type SelectScrollUpButtonProps, useForwardProps } from 'radix-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { cn } from '@/core/utils';

const props = defineProps<SelectScrollUpButtonProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <select-scroll-up-button v-bind="forwardedProps" :class="cn('flex cursor-default items-center justify-center py-1', props.class)">
    <slot>
      <font-awesome-icon :icon="['fas', 'chevron-up']" />
    </slot>
  </select-scroll-up-button>
</template>
