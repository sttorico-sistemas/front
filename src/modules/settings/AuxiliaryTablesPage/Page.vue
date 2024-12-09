<script lang="ts" setup>
	import { AuxiliarCitySection } from './components/auxiliary-city-section'
	import { AuxiliarTypeSection } from './components/auxiliary-type-section'
	import Breadcrumbs from 'src/core/components/Breadcrumbs.vue'
</script>

<template>
	<main>
		<breadcrumbs :paginas="['Configurações', 'Tabelas Auxiliares']" />

		<div class="grid grid-cols-1 md:grid-cols-2 gap-x-20">
			<auxiliar-type-section />
			<auxiliar-city-section />
		</div>
	</main>
</template>
