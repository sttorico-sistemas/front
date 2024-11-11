<script lang="ts" setup>
defineProps<{
  layoutName: 'default-layout';
}>();
</script>

<template>
  <component :is="layoutName">
    <slot></slot>
  </component>
</template>