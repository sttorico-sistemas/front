<script lang="ts" setup>
	import { useRoute } from 'vue-router'
	import { onMounted, shallowRef, watch } from 'vue'

	import SimuladorTaxaJuros from '../components/simulador/simulador-taxa-juros.vue'

	const route = useRoute()

	const currentComponent = shallowRef<any>(null)

	watch([route, currentComponent], () => {
		switch (route.name) {
			case 'simulador-taxa-juros':
				currentComponent.value = SimuladorTaxaJuros
				break
		}
	})

	onMounted(() => {
		currentComponent.value = route.name
	})
</script>

<template>
	<component :is="currentComponent" />
</template>
