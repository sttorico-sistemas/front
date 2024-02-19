<script lang="ts" setup>
	import { useRoute } from 'vue-router'
	import { onMounted, shallowRef, watch } from 'vue'

	import consultasAtualizacaoMargens from '../components/consultas/consultas-atualizacao-margens.vue'
	import ConsultasConsignataria from '../components/consultas/consultas-consignataria.vue'
	import ConsultasContratos from '../components/consultas/consultas-contrato.vue'
	import ConsultasHistorico from '../components/consultas/consultas-historico.vue'
	import ConsultasHistoricoReservaMargem from '../components/consultas/consultas-historico-reserva-margem.vue'
	import ConsultasRmc from '../components/consultas/consultas-rmc.vue'
	import ConsultasSolicitacoes from '../components/consultas/consultas-solicitacoes.vue'

	const route = useRoute()

	const currentComponent = shallowRef<any>(null)

	watch([route, currentComponent], () => {
		switch (route.name) {
			case 'consultas-rmc':
				currentComponent.value = ConsultasRmc
				break
			case 'consultas-contratos':
				currentComponent.value = ConsultasContratos
				break
			case 'consultas-historico':
				currentComponent.value = ConsultasHistorico
				break
			case 'consultas-consignataria':
				currentComponent.value = ConsultasConsignataria
				break
			case 'consultas-atualizacao-margens':
				currentComponent.value = consultasAtualizacaoMargens
				break
			case 'consultas-historico-reserva-margem':
				currentComponent.value = ConsultasHistoricoReservaMargem
				break
			case 'consultas-solicitacoes':
				currentComponent.value = ConsultasSolicitacoes
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
