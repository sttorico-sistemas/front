<script lang="ts" setup>
  // Core
  import { computed } from 'vue'

  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text'
    },
    classWrapper: {
      type: String,
      default: 'w-auto'
    },
    classLabel: {
      type: String,
      default: 'text-xs'
    },
    classInput: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    layout: {
      type: String,
      default: 'row',
    },
  })

  const maskPhone = () => {
    if (props.type === 'cel') return '(##) # ####-####'
    if (props.type === 'tel') return '(##) ####-####'
    if (props.type === 'cpf') return '###.###.###-##'
    if (props.type === 'cnpj') return '##.###.###/####-##'
  }

  const classDisabled = computed(() => {
    return props.disabled ? 'disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed' : ''
  })
</script>
<template>
  <div v-if="props.layout === 'row'" :class="props.classWrapper">
    <label for="props.id" class="mb-0" :class="props.classLabel">{{ props.label }}</label>
    <input
      :id="props.id"
      :type="props.type"
      class="form-input h-[38px]"
      :class="[props.classInput, classDisabled]"
      :value="props.value"
      :disabled="props.disabled"
      :required="props.required"
      v-maska="maskPhone()"
    />
  </div>
  <div v-if="props.layout === 'col'" class="flex sm:flex-row flex-col items-center mb-3">
    <label :for="props.id" class="mb-0 sm:w-1/5 sm:mr-2 w-full text-left" :class="props.classLabel">{{ props.label }}</label>
    <input
      :id="props.id"
      :type="props.type"
      :placeholder="props.placeholder"
      class="form-input flex-1"
      :class="[props.classInput, classDisabled]"
      :disabled="props.disabled"
      :required="props.required"
      v-maska="maskPhone()"
    />
  </div>
</template>
<style>
input[type="date"]:not(:focus):in-range::-webkit-datetime-edit {
  color: transparent;
}
::-webkit-calendar-picker-indicator {
  filter: brightness(0) saturate(100%) invert(36%) sepia(82%) saturate(799%) hue-rotate(158deg) brightness(95%) contrast(86%);
}
</style>
