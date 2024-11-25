<script setup lang="ts">
import { MenubarSub, type MenubarSubEmits, useForwardPropsEmits } from 'radix-vue'

interface MenubarSubRootProps {
  defaultOpen?: boolean
  open?: boolean
}

const props = defineProps<MenubarSubRootProps>()
const emits = defineEmits<MenubarSubEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <menubar-sub v-bind="forwarded">
    <slot />
  </menubar-sub>
</template>