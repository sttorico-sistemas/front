<script lang="ts" setup>
	
	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'

	import DadosConsignante from './cadastro-dados-consignante/cadastro-dados-consignante.vue'
	import ContratoSistema from './cadastro-contrato-sistema/cadastro-contrato-sistema.vue'
	import ListaGestores from './cadastro-lista-gestores/cadastro-lista-gestores.vue'
	import ListaAverbadores from './cadastro-lista-averbadores/cadastro-lista-averbadores.vue'
	import LogsAlteracao from './logs-alteracao/logs-alteracao.vue'
	
	// Icons

	// Declarações

	// Script

</script>
<template>
	<main>
		<breadcrumbs :paginas="['Cadastro', 'Consignante']" />

    <dados-consignante />
    <contrato-sistema />
    <lista-gestores />
    <lista-averbadores />
    <div class="panel mt-6">Consignatárias Habilitadas</div>
    <logs-alteracao />
	</main>
</template>
<style lang="scss" scoped></style>
