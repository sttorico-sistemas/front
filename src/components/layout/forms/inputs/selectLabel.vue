<script lang="ts" setup>
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
    classWrapper: {
      type: String,
      default: 'w-auto'
    },
    classLabel: {
      type: String,
      default: 'text-xs'
    },
    classSelect: {
      type: String,
      default: 'text-xs'
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
    options: {
      type: Array,
      default: () => []
    }
  })

  const classDisabled = computed(() => {
    return props.disabled ? 'disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed' : ''
  })
</script>
<template>
  <div v-if="props.layout === 'row'" :class="props.classWrapper">
    <label for="props.id" class="mb-0" :class="props.classLabel">{{ props.label }}</label>
    <select
      :id="props.id"
      class="form-select h-[38px] flex-1"
      :class="[classSelect, classDisabled]"
      :required="props.required"
      :disabled="props.disabled"
    >
      <option value="">{{ props.placeholder }}</option>
      <option
        v-for="(option, idx) in options"
        :value="props.value"
      >{{ option }}</option>
    </select>
  </div>

  <div v-if="props.layout === 'col'" class="flex sm:flex-row flex-col items-center mb-3">
    <label :for="props.id" class="mb-0 md:w-1/5 mr-2 w-full text-left" :class="props.classLabel">{{ props.label }}</label>
    <select
      :id="props.id"
      class="form-select h-[38px] flex-1"
      :class="[classSelect, classDisabled]"
      :required="props.required"
      :disabled="props.disabled"
    >
      <option value="">{{ props.placeholder }}</option>
      <option
        v-for="(option, idx) in options"
        :value="props.value"
      >{{ option }}</option>
    </select>
  </div>
</template>
