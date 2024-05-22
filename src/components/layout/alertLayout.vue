<script lang="ts" setup>
  import { reactive, ref } from 'vue'

  // Icons
  import IconClose from '@icons/iconClose.vue'
</script>
<template>
  <div class="flex items-center p-3.5 rounded text-danger bg-danger-light absolute right-5 bottom-5 z-[9999]">
    <span class="pr-2 pl-2">
      <strong class="mr-1 ml-1">Danger!</strong>Lorem Ipsum is simply dummy text of the printing.
    </span>
    <button type="button" class="ml-auto mr-auto hover:opacity-80">
        <icon-close class="w-5 h-5" />
    </button>
  </div>
</template>
