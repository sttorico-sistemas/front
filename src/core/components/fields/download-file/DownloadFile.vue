<script setup lang="ts">
	import { type HTMLAttributes } from 'vue'
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

	import { ButtonRoot } from '@/core/components/button'

	const props = defineProps<{
		url: string
		suggestedName: string
		class?: HTMLAttributes['class']
		disabled?: boolean
	}>()

	async function handleDownload() {
		const a = document.createElement('a')
		a.href = props.url
		a.download = props.suggestedName
		a.target = '_blank'
		a.style.display = 'none'
		a.rel = 'noopener noreferrer'
		document.body.append(a)
		a.click()
		setTimeout(() => {
			a.remove()
		}, 1000)
	}
</script>

<template>
	<button-root
		:disabled="props.disabled"
		variant="ghost"
		class="text-primary_3-table font-bold"
		@click="handleDownload"
	>
		<font-awesome-icon class="w-5 h-5 mr-2" :icon="['fas', 'download']" />
		Ver Documento
	</button-root>
</template>
