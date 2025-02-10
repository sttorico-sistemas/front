<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
	value: string;
	size?: number;
	bgColor?: string;
	textColor?: string;
}>(), {
	size: 5,
	bgColor: 'bg-primary',
	textColor: 'text-white',
});

const size = computed(() => {
	return `size-${props.size}`
})
</script>

<template>
	<span class="rounded-full flex justify-center items-center font-medium py-[1px] px-[7px]"
		:class="[size, bgColor, textColor]">{{ value }}</span>
</template>
