<script lang="ts" setup>

	// Componentes
	import titulo from '@components/layout/tituloLayout.vue'
	import breadcrumbs from '@components/layout/breadcrumbsLayout.vue'
  import TabelasAuxiliares from './tabelas-auxiliares/tabelas-auxiliares.vue'
  import TabelasCidades from './tabelas-auxiliares/tabelas-cidades.vue'

</script>
<template>
	<main>
		<breadcrumbs :paginas="['Configurações', 'Tabelas Auxiliares']" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-20">
      <tabelas-auxiliares title="Cadastro de Tabelas Auxiliares 1" />
      <tabelas-cidades />
      <tabelas-auxiliares title="Cadastro de Tabelas Auxiliares 2" />
      <tabelas-auxiliares title="Cadastro de Tabelas Auxiliares 3" />
    </div>
	</main>
</template>

