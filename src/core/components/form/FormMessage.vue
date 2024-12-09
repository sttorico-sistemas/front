<script lang="ts" setup>
	import { ErrorMessage } from 'vee-validate'
	import { toValue } from 'vue'
	import { useFormField } from './useFormField'

	const { name, formMessageId, error } = useFormField()
</script>

<template>
	<div>
		<error-message
			v-if="error"
			:id="formMessageId"
			as="p"
			:name="toValue(name)"
			class="text-sm font-medium text-danger"
		/>
		<div class="text-sm font-medium text-transparent" v-else>Erro</div>
	</div>
</template>
