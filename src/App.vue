<script setup>
import { useMeta } from 'src/core/composables/use_meta'

useMeta({ title: 'Gestão Das Consignações | Infoconsig' })
</script>

<template>
	<app-layout layout-name="default-layout" class="dashboard-layout">
		<router-view></router-view>
	</app-layout>
</template>

<style lang="scss" scoped>
.dashboard-layout {
	max-width: 1920px;
	margin: 0 auto;
	padding: 13px 20px;
}
</style>
