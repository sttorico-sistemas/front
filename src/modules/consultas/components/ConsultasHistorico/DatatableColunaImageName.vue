<script lang="ts" setup>
const props = withDefaults(defineProps<{
	image?: string;
	name?: string;
	description?: string;
}>(), {
	image: '',
	name: '',
	description: '',
});
</script>

<template>
	<div class="flex items-center gap-1 justify-left" :class="!props.name.length ? '_justify-center' : '_justify-left'">
		<slot />
		<img class="w-30 h-30 rounded-full object-cover" :src="props.image" />
		<div>
			<span class="text-dark text-sm font-semibold">{{ props.name }}</span>
			<p class="text-dark text-xs font-semibold">{{ props.description }}</p>
		</div>
	</div>
</template>
