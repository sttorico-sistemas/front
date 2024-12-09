<script setup lang="ts">
	import { type HTMLAttributes, computed } from 'vue'
	import {
		TagsInputItemText,
		type TagsInputItemTextProps,
		useForwardProps,
	} from 'radix-vue'
	import { cn } from '@/core/utils'

	const props = defineProps<
		TagsInputItemTextProps & { class?: HTMLAttributes['class'] }
	>()

	const delegatedProps = computed(() => {
		const { class: _, ...delegated } = props

		return delegated
	})

	const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<tags-input-item-text
		v-bind="forwardedProps"
		:class="cn('py-1 px-2 text-sm text-white rounded bg-transparent', props.class)"
	/>
</template>
