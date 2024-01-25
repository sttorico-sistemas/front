<script lang="ts" setup>
	import { useRoute } from 'vue-router'
	import { shallowRef, watch } from 'vue'

	import ConsultasContratos from '../components/consultas/consultas-contrato.vue'
	import ConsultasRmc from '../components/consultas/consultas-rmc.vue'

	const route = useRoute()

	const currentComponent = shallowRef(ConsultasRmc)

	watch(route, () => {
		switch (route.name) {
			case 'consultas-rmc':
				currentComponent.value = ConsultasRmc
				break
			case 'consultas-contratos':
				currentComponent.value = ConsultasContratos
				break
		}
	})
</script>

<template>
	<component :is="currentComponent" />
</template>
