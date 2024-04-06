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
    required: {
      type: Boolean,
      default: false,
    },
    layout: {
      type: String,
      default: 'row',
    },
  })
</script>
<template>
  <div v-if="props.layout === 'row'" :class="props.classWrapper">
    <label for="props.id" :class="props.classLabel">{{ props.label }}</label>
    <input 
      :id="props.id" 
      :type="props.type" 
      class="form-input h-[38px]" 
      :class="props.classInput" 
      :value="props.value"
      :disabled="props.disabled" 
      :required="props.required"
    />
  </div>
  <div v-if="props.layout === 'col'" class="flex sm:flex-row flex-col items-center mb-3">
    <label :for="props.id" class="mb-0 sm:w-1/5 sm:mr-2 w-full text-left" :class="props.classLabel">{{ props.label }}</label>
    <input 
      :id="props.id" 
      :type="props.type" 
      :placeholder="props.placeholder" 
      class="form-input flex-1" 
      :class="props.classInput" 
      :disabled="props.disabled" 
      :required="props.required"
    />
  </div>
</template>