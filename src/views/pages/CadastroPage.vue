<script lang="ts" setup>
	import { useRoute } from 'vue-router'
	import { onMounted, shallowRef, watch } from 'vue'

	import cadastroConsignante from '../components/cadastro/cadastro-consignante.vue'
	import cadastroConsignataria from '../components/cadastro/cadastro-consignataria.vue'
	import cadastroOperador from '../components/cadastro/cadastro-operador.vue'
	import cadastroPerfilOperador from '../components/cadastro/cadastro-perfil-operador.vue'
	import cadastroAdministrador from '../components/cadastro/cadastro-administrador.vue'

	const route = useRoute()

	const currentComponent = shallowRef<any>(null)

	watch([route, currentComponent], () => {
		switch (route.name) {
			case 'cadastro-consignataria':
				currentComponent.value = cadastroConsignataria
				break
			case 'cadastro-consignante':
				currentComponent.value = cadastroConsignante
				break
			case 'cadastro-operador':
				currentComponent.value = cadastroOperador
				break
			case 'cadastro-perfil-operador':
				currentComponent.value = cadastroPerfilOperador
				break
			case 'cadastro-administrador':
				currentComponent.value = cadastroAdministrador
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
