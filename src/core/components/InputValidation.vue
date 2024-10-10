<script setup lang="ts">
withDefaults(defineProps<{
	modelValue?: string;
	id?: string;
	label?: string;
	type?: string;
	placeholder?: string;
	styleClass?: string;
	messageError?: string;
	isSubmitForm?: boolean;
	error?: boolean;
}>(), {
	id: '',
	modelValue: '',
	label: '',
	type: 'text',
	placeholder: '',
	styleClass: '',
	messageError: '',
	isSubmitForm: false,
	error: false,
});

const emit = defineEmits(['update:modelValue'])
</script>

<template>
	<div :class="{
		'has-error': error,
	}">
		<label for="{{ id }}" class="text-xs">{{ label }}</label>
		<input :id="id" :value="modelValue" :type="type" :placeholder="placeholder" class="form-input" :class="styleClass"
			@input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" />
		<div v-if="isSubmitForm && error">
			<p class="text-danger mt-1">{{ messageError }}</p>
		</div>
	</div>
</template>
