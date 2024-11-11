<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue'
import IconClose from 'src/core/components/Icons/IconClose.vue'
import IconCheck from 'src/core/components/Icons/IconCheck.vue'
import IconInfo from 'src/core/components/Icons/IconInfo.vue'
import { Emitter, EventType } from 'mitt';

const eventBus = inject<Emitter<Record<EventType, any>>>('eventBus')
const message = ref<string>('')
const type = ref<string>('info')

const showAlert = (e: {
  message: string;
  type: string;
}) => {
  message.value = e.message
  type.value = e.type
  setTimeout(() => message.value = '', 4000)
}

onMounted(() => {
  eventBus?.on('alert', showAlert)
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
  <div class="flex items-center p-3.5 transition ease-linear duration-1000 rounded absolute right-5 bottom-5 z-[9999]"
    :class="[!message.length ? 'translate-x-[1000px] hidden' : 'translate-x-0', setupAlert().color]">
    <span class="pr-2 pl-2">
      {{ message }}
    </span>
    <button type="button" class="ml-auto mr-auto hover:opacity-80" @click="message = ''">
      <component :is="setupAlert().icon" />
    </button>
  </div>
</template>
