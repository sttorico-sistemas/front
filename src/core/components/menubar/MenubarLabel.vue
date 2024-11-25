<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/core/utils'
import { MenubarLabel, type MenubarLabelProps } from 'radix-vue'

const props = defineProps<MenubarLabelProps & { class?: HTMLAttributes['class'], inset?: boolean }>()
</script>

<template>
  <menubar-label :class="cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', props.class)">
    <slot />
  </menubar-label>
</template>