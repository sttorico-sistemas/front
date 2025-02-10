<script setup lang="ts">
	import type { HTMLAttributes } from 'vue'

	import { cn } from '@/core/utils'

	const props = defineProps<{
		class?: HTMLAttributes['class']
		size?: number
	}>()
</script>

<template>
	<td
		:style="{ width: `${size}px` }"
		:class="cn('align-middle [&:has([role=checkbox])]:pr-0', props.class)"
	>
		<slot />
	</td>
</template>
