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
	import ConsultasResumoMargem from '../components/consultas/consultas-resumo-margem.vue'
	import ConsultasPrevisaoDescontos from '../components/consultas/consultas-previsao-descontos.vue'
	import ConsultasConsigantesMaster from '../components/consultas/consultas-consignante-master.vue'
	import ConsultasConsigantes from '../components/consultas/consultas-consignantes.vue'
	import ConsultasPessoas from '../components/consultas/consultas-pessoas.vue'

	import ConsultasConsignatariaAdmin from '../components/consultas/consultas-consignataria-admin.vue'

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
			case 'consultas-consignataria-servidor':
				currentComponent.value = ConsultasConsignataria
				break
			case 'consultas-consignataria-admin':
				currentComponent.value = ConsultasConsignatariaAdmin
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
			case 'consultas-resumo-margem':
				currentComponent.value = ConsultasResumoMargem
				break
			case 'consultas-previsao-descontos':
				currentComponent.value = ConsultasPrevisaoDescontos
				break
			case 'consultas-consignante-master':
				currentComponent.value = ConsultasConsigantesMaster
				break
			case 'consultas-consignantes':
				currentComponent.value = ConsultasConsigantes
				break
			case 'consultas-pessoas':
				currentComponent.value = ConsultasPessoas
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
