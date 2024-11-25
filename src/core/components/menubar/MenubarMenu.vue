<script setup lang="ts">
import { MenubarMenu, type MenubarMenuProps } from 'radix-vue'

const props = defineProps<MenubarMenuProps>()
</script>

<template>
  <menubar-menu v-bind="props">
    <slot />
  </menubar-menu>
</template>