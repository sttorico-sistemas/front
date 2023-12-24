<script lang="ts" setup>
	defineProps({
		title: {
			type: String,
			default: '',
		},
	})
</script>
<template>
	<h5 class="text-lg font-semibold text-primary_3-table">
		{{ title }}
	</h5>
</template>
