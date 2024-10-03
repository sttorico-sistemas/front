<script setup>
import { useMeta } from '@/core/composables/use-meta'

useMeta({ title: 'Gestão Das Consignações | Infoconsig' })
</script>

<template>
	<div class="dashboard-layout">
		<app-layout layout-name="default-layout">
			<router-view></router-view>
		</app-layout>
	</div>
</template>

<style lang="scss" scoped>
.dashboard-layout {
	max-width: 1920px;
	margin: 0 auto;
	padding: 13px 20px;
}
</style>
