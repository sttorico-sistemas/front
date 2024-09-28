<script lang="ts" setup>
	import { useRoute } from 'vue-router'
	import { onMounted, shallowRef, watch } from 'vue'

	import mainLayout from '@components/layout/mainLayout.vue'
	import TabelasAuxiliares from '../components/configuracoes/tabelas-auxiliares.vue'
	import Logomarcas from '../components/configuracoes/logomarcas.vue'

	const route = useRoute()

	const currentComponent = shallowRef<any>(null)

	watch([route, currentComponent], () => {
		switch (route.name) {
			case 'configuracoes-tabelas-auxiliares':
				currentComponent.value = TabelasAuxiliares
				break
			case 'configuracoes-logomarcas':
				currentComponent.value = Logomarcas
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
