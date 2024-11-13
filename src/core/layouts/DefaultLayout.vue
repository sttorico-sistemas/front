<script lang="ts" setup>
import HeaderComponent from '../components/Header.vue';
import FooterComponent from '../components/Footer.vue';
import AlertComponent from '../components/Alert.vue';
</script>

<template>
  <div>
    <header-component></header-component>
    <slot></slot>
    <footer-component></footer-component>
    <alert-component></alert-component>
  </div>
</template>