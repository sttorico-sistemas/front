<script setup lang="ts">
defineProps<{
  paginas: string[];
}>()

const separatorClass = (index: number) => {
  if (index) {
    return 'before:content-["/"] before:px-1.5';
  }
  return '';
}
</script>

<template>
  <ol class="flex">
    <li v-for="(pagina, index) in paginas" :key="index" :class="separatorClass(index)">
      <a href="javascript:;">{{ pagina }}</a>
    </li>
  </ol>
</template>

<style lang="scss" scoped>
ol {
  color: #0e1726;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  li:first-child {
    @apply text-primary;
  }
}
</style>
