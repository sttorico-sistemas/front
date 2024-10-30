<script lang="ts" setup>
import Breadcrumbs from 'src/core/components/Breadcrumbs.vue';
import TabelasCidades from '../components/TabelasAuxiliares/TabelasCidades.vue';
import TabelaTipos from '../components/TabelasAuxiliares/TabelaTipos.vue';
</script>

<template>
  <main>
    <breadcrumbs :paginas="['Configurações', 'Tabelas Auxiliares']" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-20">
      <tabela-tipos />
      <tabelas-cidades />
    </div>
  </main>
</template>
