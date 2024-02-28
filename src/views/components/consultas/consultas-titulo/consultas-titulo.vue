<script lang="ts" setup>
	defineProps({
		title: {
			type: String,
			default: '',
		},
		infoMessage: {
			type: String,
			default: '',
		},
	})

	// Icons
	import IconInfo from '@icons/iconInfo.vue'
</script>
<template>
	<div class="flex gap-12">
		<h5 class="text-lg font-semibold text-primary_3-table">
			{{ title }}
		</h5>
		<div v-show="infoMessage.length" class="flex self-center">
			<button v-tippy:top><icon-info /></button>
			<tippy target="top" placement="top">{{ infoMessage }}</tippy>
		</div>
	</div>
</template>
