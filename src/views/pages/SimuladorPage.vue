<script lang="ts" setup>
	import { useRoute } from 'vue-router'
	import { onMounted, shallowRef, watch } from 'vue'

	import mainLayout from '@components/layout/mainLayout.vue'
	import SimuladorCalculadora from '../components/simulador/simulador-calculadora.vue'
	import SimuladorEmprestimos from '../components/simulador/simulador-emprestimos.vue'
	import SimuladorTaxaJuros from '../components/simulador/simulador-taxa-juros.vue'

	const route = useRoute()

	const currentComponent = shallowRef<any>(null)

	watch([route, currentComponent], () => {
		switch (route.name) {
			case 'simulador-taxa-juros':
				currentComponent.value = SimuladorTaxaJuros
				break
			case 'simulador-calculadora':
				currentComponent.value = SimuladorCalculadora
				break
			case 'simulador-emprestimos':
				currentComponent.value = SimuladorEmprestimos
				break
		}
	})

	onMounted(() => {
		currentComponent.value = route.name
	})
</script>

<template>
	<main-layout>
		<component :is="currentComponent" />
	</main-layout>
</template>
