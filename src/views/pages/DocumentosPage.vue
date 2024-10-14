<script lang="ts" setup>
	import { useRoute } from 'vue-router'
	import { onMounted, shallowRef, watch } from 'vue'

	import mainLayout from '@components/layout/mainLayout.vue'
	import DocumentosArquivados from '../components/documentos/documentos-arquivados.vue'

	const route = useRoute()

	const currentComponent = shallowRef<any>(null)

	watch([route, currentComponent], () => {
		switch (route.name) {
			case 'documentos-arquivados':
				currentComponent.value = DocumentosArquivados
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
