<script lang="ts" setup>
// Componentes
import breadcrumbs from 'src/core/components/Breadcrumbs.vue'
import CadastroPerfilOperador from './CadastroOperadorPage.vue'
</script>
<template>
  <main>
    <breadcrumbs :paginas="['Consultas', 'Perfil Operador']" />

    <cadastro-perfil-operador add-button class="mt-6" />
  </main>
</template>
