<script setup lang="ts">
import {
  DialogRoot,
  type DialogRootEmits,
  type DialogRootProps,
  useForwardPropsEmits,
} from 'radix-vue'

const properties = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(properties, emits)
</script>

<template>
  <dialog-root v-bind="forwarded">
    <slot />
  </dialog-root>
</template>
