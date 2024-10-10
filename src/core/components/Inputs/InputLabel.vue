<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  id: string;
  label: string;
  type?: 'cel' | 'tel' | 'cpf' | 'cnpj' | 'text';
  classWrapper?: string;
  classLabel?: string;
  classInput?: string;
  placeholder?: string;
  modelValue: string;
  disabled?: boolean;
  required?: boolean;
  layout?: 'row' | 'col';
}>(), {
  type: 'text',
  classWrapper: 'w-auto',
  classLabel: 'text-xs',
  classInput: '',
  placeholder: '',
  disabled: false,
  required: false,
  layout: 'row',
});

const emit = defineEmits(['update:modelValue'])

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
  <div v-if="layout === 'row'" :class="classWrapper">
    <label for="id" class="mb-0" :class="classLabel">{{ label }}</label>
    <input :id="id" :type="type" :value="modelValue" class="form-input h-[38px]" :class="[classInput, classDisabled]"
      :disabled="disabled" :required="required" v-maska="maskPhone()"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" />
  </div>
  <div v-if="layout === 'col'" class="flex sm:flex-row flex-col items-center mb-3">
    <label :for="id" class="mb-0 sm:w-1/5 sm:mr-2 w-full text-left" :class="classLabel">{{ label }}</label>
    <input :id="id" :type="type" :value="modelValue" :placeholder="placeholder" class="form-input flex-1"
      :class="[classInput, classDisabled]" :disabled="disabled" :required="required" v-maska="maskPhone()"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" />
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
