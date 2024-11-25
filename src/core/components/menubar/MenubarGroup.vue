<script setup lang="ts">
import { MenubarGroup, type MenubarGroupProps } from 'radix-vue'

const props = defineProps<MenubarGroupProps>()
</script>

<template>
  <menubar-group v-bind="props">
    <slot />
  </menubar-group>
</template>