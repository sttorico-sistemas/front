<script lang="ts" setup>
const props = withDefaults(defineProps<{
	color?: number;
	percent: number;
}>(), {
	color: 1,
});

const color = (value: number) => {
	switch (value) {
		case 1:
			return 'bg-dark-primary'
		case 2:
			return 'bg-info'
		case 3:
			return 'bg-success'
		case 4:
			return 'bg-warning'
	}
}
</script>

<template>
	<div class="w-10/12 rounded-full h-2 bg-dark-light shadow">
		<div class="h-full rounded-full" :class="color(props.color)" :style="`width: ${percent}%`" />
	</div>
</template>