<script setup>
	// import { RouterLink, RouterView } from 'vue-router'

	import footerLayout from '@components/layout/footerLayout.vue'
	import headerLayout from '@components/layout/headerLayout.vue'
	import alertLayout from '@components/layout/alertLayout.vue'
</script>

<template>
	<div class="dashboard-layout">
		<header-layout />

		<slot />

		<footer-layout />
		<alert-layout />
	</div>
</template>

<style lang="scss" scoped>
	.dashboard-layout {
		max-width: 1920px;
		margin: 0 auto;
		padding: 13px 20px;
	}
	.main {
		height: 90vh;
	}
</style>
