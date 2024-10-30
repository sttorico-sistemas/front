<script setup lang="ts">
import { computed, InputTypeHTMLAttribute } from 'vue';
import uniqid from 'uniqid';

const props = withDefaults(defineProps<{
  id?: string;
  label?: string;
  class?: string;
  modelValue?: string;
  type?: InputTypeHTMLAttribute;
  placeholder?: string;
  message?: string;
  error?: boolean;
  disabled?: boolean;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  width?: string;
  height?: string;
  mask?: 'cel' | 'tel' | 'cpf' | 'cnpj' | string;
}>(), {
  label: '',
  modelValue: '',
  class: '',
  type: 'text',
  placeholder: '',
  message: '',
  error: false,
  disabled: false,
});

defineEmits(['update:modelValue', 'submit']);

const randomId = computed(() => {
  return uniqid('input-');
});

const mask = computed(() => {
  switch (props.mask) {
    case '':
      
      break;
  
    default:
      break;
  }
})
</script>

<template>
  <div :class="{ 'has-error': error }">
    <label :for="id ?? randomId" class="text-xs">
      {{ label }}
    </label>
    <input :id="id ?? randomId" :type="type" :value="modelValue" :placeholder="placeholder"
      :class="`form-input ${props.class}`" :disabled="disabled" :style="{
        minWidth: props.minWidth,
        maxWidth: props.maxWidth,
        minHeight: props.minHeight,
        maxHeight: props.maxHeight,
        width: props.width,
        height: props.height
      }" @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @keydown.enter="$emit('submit')">
    <div v-if="message">
      <p class="text-danger mt-1">{{ message }}</p>
    </div>
  </div>
</template>
