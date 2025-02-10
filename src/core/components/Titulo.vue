<script lang="ts" setup>
import IconInfo from 'src/core/components/Icons/IconInfo.vue'

withDefaults(defineProps<{
	title?: string;
	classStyle?: string;
	infoMessage?: string;
}>(), {
	title: '',
	classStyle: 'text-lg font-semibold text-primary',
	infoMessage: '',
});
</script>

<template>
	<div class="flex gap-12">
		<h5 :class="classStyle">
			{{ title }}
		</h5>
		<div v-show="infoMessage.length" class="flex self-center">
			<button v-tippy:top><icon-info /></button>
			<tippy target="top" placement="top">{{ infoMessage }}</tippy>
		</div>
	</div>
</template>
