<script lang="ts" setup>
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
      default: 'w-full'
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
  })
</script>
<template>
  <div :class="props.classWrapper">
    <label for="props.id" :class="props.classLabel">{{ props.label }}</label>
    <input 
      :id="props.id" 
      :type="props.type" 
      class="form-input h-[38px]" 
      :class="props.classInput" 
      :value="props.value"
      :disabled="props.disabled" 
    />
  </div>
</template>