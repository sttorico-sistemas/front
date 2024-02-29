<script setup>
	defineProps({
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
			:type="type"
			:placeholder="placeholder"
			class="form-input"
			:class="styleClass"
		/>
		<div v-if="isSubmitForm && error">
			<p class="text-danger mt-1">{{ messageError }}</p>
		</div>
	</div>
</template>
