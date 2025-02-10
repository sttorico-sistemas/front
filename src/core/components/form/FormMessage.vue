<script lang="ts" setup>
	import { ErrorMessage } from 'vee-validate'
	import { toValue } from 'vue'
	import { useFormField } from './useFormField'

	const { name, formMessageId, error } = useFormField()

	defineProps({
		hasPosition: {
			default: () => true,
			type: Boolean,
		},
	})
</script>

<template>
	<div v-if="error">
		<error-message
			:id="formMessageId"
			as="p"
			:name="toValue(name)"
			class="text-sm font-medium text-danger mb-2"
		/>
	</div>
	<div
		v-else-if="hasPosition"
		class="text-sm font-medium text-transparent"
	>Error</div>
</template>
