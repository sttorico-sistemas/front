<script lang="ts" setup>
	import { useRoute } from 'vue-router'
	import { onMounted, shallowRef, watch } from 'vue'

	import TabelasAuxiliares from '../components/configuracoes/tabelas-auxiliares.vue'

	const route = useRoute()

	const currentComponent = shallowRef<any>(null)

	watch([route, currentComponent], () => {
		switch (route.name) {
			case 'configuracoes-tabelas-auxiliares':
				currentComponent.value = TabelasAuxiliares
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
