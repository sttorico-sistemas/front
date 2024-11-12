<script lang="ts" setup>
import { useRoute } from 'vue-router'
import HeaderComponent from '../components/Header.vue'
import FooterComponent from '../components/Footer.vue'
import AlertComponent from '../components/Alert.vue'

// Obtenha a rota atual para verificar a meta
const route = useRoute()
</script>

<template>
  <div>
    <!-- Renderiza Header e Footer apenas se `meta.noHeaderFooter` não estiver definido -->
    <header-component v-if="!route.meta.noHeaderFooter"></header-component>
    
    <!-- Conteúdo da página -->
    <slot></slot>
    
    <footer-component v-if="!route.meta.noHeaderFooter"></footer-component>

    <!-- Alerta é sempre renderizado -->
    <alert-component></alert-component>
  </div>
</template>
