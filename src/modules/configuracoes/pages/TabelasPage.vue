<script lang="ts" setup>
import Breadcrumbs from 'src/core/components/Breadcrumbs.vue';
import TabelasBase from '../components/TabelasAuxiliares/TabelasBase.vue';
import TabelasCidades from '../components/TabelasAuxiliares/TabelasCidades.vue';
</script>

<template>
  <main>
    <breadcrumbs :paginas="['Configuraçõess', 'Tabelas Auxiliares']" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-20">
      <tabelas-base title="Cadastro de Tabelas Auxiliares 1" />
      <tabelas-cidades />
      <tabelas-base title="Cadastro de Tabelas Auxiliares 2" />
      <tabelas-base title="Cadastro de Tabelas Auxiliares 3" />
    </div>
  </main>
</template>
