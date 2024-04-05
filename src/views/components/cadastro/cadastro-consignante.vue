<script lang="ts" setup>
	
	// Componentes
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'

	import DadosConsignante from './cadastro-dados-consignante/cadastro-dados-consignante.vue'
	
	// Icons

	// Declarações

	// Script

</script>
<template>
	<main>
		<breadcrumbs :paginas="['Cadastro', 'Consignante']" />

    <dados-consignante />
    <div class="panel mt-6">Contratos Sistema</div>
    <div class="panel mt-6">Lista de Gestores</div>
    <div class="panel mt-6">Lista de Averbadores</div>
    <div class="panel mt-6">Consignatárias Habilitadas</div>
    <div class="panel mt-6">Logs de Alterações</div>
	</main>
</template>
<style lang="scss" scoped></style>
