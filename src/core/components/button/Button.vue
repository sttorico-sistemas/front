<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/core/utils';

import { type ButtonVariants, buttonVariants } from '.'

interface Properties extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  as?: string
  class?: HTMLAttributes['class']
}

const properties = withDefaults(defineProps<Properties>(), {
  as: 'button',
})
</script>

<template>
  <primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), properties.class)"
  >
    <slot />
  </primitive>
</template>
