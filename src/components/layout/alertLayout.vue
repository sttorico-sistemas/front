<script lang="ts" setup>
  import { reactive, ref, onMounted, inject } from 'vue'

  // Icons
  import IconClose from '@icons/iconClose.vue'

  // Declarações
  const eventBus = inject('eventBus')
  const message = ref<string>('')

  // Scripts
  // remover apos 3s

  // Lifecycle
  onMounted(() => {
    eventBus.on('alertDanger', (e) => {
      message.value = e
    })
  })
</script>
<template>
  <div
    class="items-center p-3.5 rounded text-danger bg-danger-light absolute right-5 bottom-5 z-[9999]"
    :class="!message.length ? 'hidden' : 'flex'"
  >
    <span class="pr-2 pl-2">
      {{ message }}
    </span>
    <button type="button" class="ml-auto mr-auto hover:opacity-80">
        <icon-close class="w-5 h-5" />
    </button>
  </div>
</template>
