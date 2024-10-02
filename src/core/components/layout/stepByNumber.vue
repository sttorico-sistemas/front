<script setup>
	import { computed } from 'vue'

	const props = defineProps({
		value: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
			default: 5,
		},
		bgColor: {
			type: String,
			default: 'bg-info',
		},
		textColor: {
			type: String,
			default: 'text-white',
		},
	})

	const size = computed(() => {
		return `size-${props.size}`
	})
</script>
<template>
	<span
		class="rounded-full flex justify-center items-center font-medium py-[1px] px-[7px]"
		:class="[size, props.bgColor, props.textColor]"
		>{{ value }}</span
	>
</template>
