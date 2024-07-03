<script lang="ts" setup>
  import { reactive, ref, onMounted, computed, inject } from 'vue'

  // Icons
  import IconClose from '@icons/iconClose.vue'
  import IconCheck from '@icons/iconCheck.vue'
  import IconInfo from '@icons/iconInfo.vue'

  // Declarações
  const eventBus = inject('eventBus')
  const message = ref<string>('')
  const type = ref<string>('info')

  // Scripts
  const showAlert = (e) => {
    message.value = e.message
    type.value = e.type
    setTimeout(() => message.value = '', 4000)
  }

  onMounted(() => {
    eventBus.on('alert', showAlert)
  })

  const setupAlert = () => {
    switch (type.value) {
      case 'success':
        return {
          color: 'text-success bg-success-light',
          icon: IconCheck
        }
      case 'danger':
        return {
          color: 'text-danger bg-danger-light',
          icon: IconClose
        }
      case 'warning':
        return {
          color: 'text-warning bg-warning-light',
          icon: IconInfo
        }
      default:
        return {
          color: 'text-info bg-info-light',
          icon: IconInfo
        }
    }
  }
</script>
<template>
  <!-- TODO - Corrigir bug de efeito de translate-x-1000 que não sai da tela, mas ao aplicar hidden, ele tira o efeito -->
  <div
    class="flex items-center p-3.5 transition ease-linear duration-1000 rounded absolute right-5 bottom-5 z-[9999]"
    :class="[!message.length ? 'translate-x-[1000px] hidden' : 'translate-x-0', setupAlert().color]"
  >
    <span class="pr-2 pl-2">
      {{ message }}
    </span>
    <button
      type="button"
      class="ml-auto mr-auto hover:opacity-80"
      @click="message = ''"
    >
        <component :is="setupAlert().icon" />
    </button>
  </div>
</template>
