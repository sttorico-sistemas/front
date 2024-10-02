<script setup>
// import { RouterLink, RouterView } from 'vue-router'

import footerLayout from '@/core/components/layout/footerLayout.vue'
import headerLayout from '@/core/components/layout/headerLayout.vue'
import alertLayout from '@/core/components/layout/alertLayout.vue'

import { useMeta } from '@/composables/use-meta'

// Meta
useMeta({ title: 'Gestão Das Consignações | Infoconsig' })
</script>

<template>
	<div class="dashboard-layout">
		<header-layout />

		<RouterView />

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
