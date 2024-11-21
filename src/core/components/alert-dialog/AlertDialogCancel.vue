<script setup lang="ts">
import { AlertDialogCancel, type AlertDialogCancelProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

import { buttonVariants } from '@/core/components/button'
import { cn } from '@/core/utils'

const props = defineProps<
  AlertDialogCancelProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <alert-dialog-cancel
    v-bind="delegatedProps"
    :class="
      cn(
        buttonVariants({ variant: 'outline' }),
        'mt-2 sm:mt-0',
        props.class,
      )
    "
  >
    <slot />
  </alert-dialog-cancel>
</template>
