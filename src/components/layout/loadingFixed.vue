<script lang="ts" setup>
	const props = defineProps({
		color: {
			type: Number,
			default: 'bg-dark-primary',
		},
		percent: {
			type: Number,
			required: true,
		},
	})

	// Scripts
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
		<div 
			class="h-full rounded-full" 
			:class="color(props.color)"
			:style="`width: ${props.percent}%`" 
		/>
	</div>
</template>