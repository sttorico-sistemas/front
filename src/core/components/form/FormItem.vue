<script lang="ts">
import type { HTMLAttributes, InjectionKey } from 'vue'

import { cn } from '@/core/utils';

export const FORM_ITEM_INJECTION_KEY
  = Symbol() as InjectionKey<string>
</script>

<script lang="ts" setup>
import { provide } from 'vue'
import { useId } from 'radix-vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const id = useId()
provide(FORM_ITEM_INJECTION_KEY, id)
</script>

<template>
  <div :class="cn('', props.class)">
    <slot />
  </div>
</template>
