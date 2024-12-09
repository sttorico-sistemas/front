<script setup lang="ts">
import type { ComboboxEmptyProps } from 'radix-vue'
import { cn } from '@/core/utils'
import { ComboboxEmpty } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<ComboboxEmptyProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <combobox-empty v-bind="delegatedProps" :class="cn('py-6 text-center text-sm', props.class)">
    <slot />
  </combobox-empty>
</template>