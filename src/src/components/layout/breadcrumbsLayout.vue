<script setup lang="ts">
	const props = defineProps({
		paginas: {
			type: Array<string>,
			required: true,
		},
	})

	const separator = (id: number) =>
		id !== 0 ? 'before:content-["/"] before:px-1.5' : ''
</script>

<template>
	<ol class="flex">
		<li v-for="(pagina, id) in props.paginas" :key="id" :class="separator(id)">
			<a href="javascript:;">{{ pagina }}</a>
		</li>
	</ol>
</template>
<style lang="scss" scoped>
	ol {
		color: #0e1726;
		font-size: 20px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;

		li:first-child {
			color: #4361ee;
		}
	}
</style>
