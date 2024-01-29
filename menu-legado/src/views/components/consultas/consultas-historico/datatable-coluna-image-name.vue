<script lang="ts" setup>
	const props = defineProps({
		image: {
			type: String,
			default: '',
		},
		name: {
			type: String,
			default: '',
		},
	})
</script>
<template>
	<div
		class="flex items-center gap-2"
		:class="!props.name.length ? 'justify-center' : 'justify-left'"
	>
		<img class="w-30 h-30 rounded-full object-cover" :src="props.image" />
		<span class="text-dark text-sm font-semibold">{{ props.name }}</span>
	</div>
</template>
