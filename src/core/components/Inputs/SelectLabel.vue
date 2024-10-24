<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  id: string;
  label: string;
  classWrapper?: string;
  classLabel?: string;
  classSelect?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  layout?: string;
  options?: any[];
}>(), {
  classWrapper: 'w-auto',
  classLabel: 'text-xs',
  classSelect: 'text-xs',
  placeholder: '',
  value: '',
  disabled: false,
  required: false,
  layout: 'row',
  options: () => [],
});

const classDisabled = computed(() => {
  return props.disabled ? 'disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed' : ''
})
</script>

<template>
  <div v-if="layout === 'row'" :class="classWrapper">
    <label for="id" class="mb-0" :class="classLabel">{{ label }}</label>
    <select :id="id" class="form-select h-[38px] flex-1 truncate overflow-hidden text-ellipsis whitespace-nowrap"
      :class="[classSelect, classDisabled]" :required="required" :disabled="disabled">
      <option value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option" :value="value">{{ option }}</option>
    </select>
  </div>

  <div v-if="layout === 'col'" class="flex sm:flex-row flex-col items-center mb-3">
    <label :for="id" class="mb-0 md:w-1/5 mr-2 w-full text-left" :class="classLabel">{{ label }}</label>
    <select :id="id" class="form-select h-[38px] flex-1 truncate overflow-hidden text-ellipsis whitespace-nowrap"
      :class="[classSelect, classDisabled]" :required="required" :disabled="disabled">
      <option value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option" :value="value">{{ option }}</option>
    </select>
  </div>
</template>
