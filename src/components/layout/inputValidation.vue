<script setup>
	defineProps({
		modelValue: {
			required: true,
		},
		id: {
			type: String,
			default: '',
		},
		label: {
			type: String,
			default: '',
		},
		type: {
			type: String,
			default: 'text',
		},
		placeholder: {
			type: String,
			default: '',
		},
		styleClass: {
			type: String,
			default: '',
		},
		messageError: {
			type: String,
			default: '',
		},
		isSubmitForm: {
			type: Boolean,
			default: false,
		},
		error: {
			type: Boolean,
			default: false,
		},
	})

	const emit = defineEmits(['update:modelValue'])
</script>
<template>
	<div
		:class="{
			'has-error': error,
		}"
	>
		<label for="{{ id }}" class="text-xs">{{ label }}</label>
		<input
			:id="id"
			:value="modelValue"
			:type="type"
			:placeholder="placeholder"
			class="form-input"
			:class="styleClass"
			@input="emit('update:modelValue', $event.target.value)"
		/>
		<div v-if="isSubmitForm && error">
			<p class="text-danger mt-1">{{ messageError }}</p>
		</div>
	</div>
</template>
