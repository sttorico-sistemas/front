<script setup lang="ts">
	import type { HTMLAttributes } from 'vue'

	import { cn } from '@/core/utils'

	const props = defineProps<{
		class?: HTMLAttributes['class']
		size?: number
		colSpan?: number
	}>()
</script>

<template>
	<th
		:colSpan="colSpan"
		:style="{ width: `${size}px` }"
		:class="
			cn(
				'px-4 text-left align-middle font-bold text-primary [&:has([role=checkbox])]:pr-0',
				props.class,
			)
		"
	>
		<slot />
	</th>
</template>
