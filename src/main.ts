// Importação do FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'; // Ícones sólidos (você pode adicionar outros pacotes conforme necessário)

// Adiciona os ícones à biblioteca
library.add(fas);

// Outras importações do projeto
import 'public/assets/css/app.css';
import App from './App.vue';
import { createApp } from 'vue';
import router from './core/router';
import { createHead } from '@vueuse/head';
import mitt from 'mitt';
import DefaultLayout from './core/layouts/DefaultLayout.vue';
import AppLayout from './core/layouts/AppLayout.vue';
import { TippyPlugin } from 'tippy.vue';
import Maska from 'maska';
import VueApexCharts from 'vue3-apexcharts';
import Popper from 'vue3-popper';
import JsonExcel from 'vue-json-excel3';
import Multiselect from '@suadelabs/vue3-multiselect';
import { createPinia } from 'pinia';
import 'select2';
import 'select2/dist/css/select2.min.css';
import $ from 'jquery';
window.$ = $; // Torna o $ globalmente acessível

const app = createApp(App);
const pinia = createPinia();

// Componentes globais
app.component('default-layout', DefaultLayout);
app.component('app-layout', AppLayout);
app.component('Popper', Popper);
app.component('DownloadExcel', JsonExcel);
app.component('Multiselect', Multiselect);
app.component('font-awesome-icon', FontAwesomeIcon); // Registro do FontAwesome como componente global

// Uso de plugins
app.use(pinia);
app.use(createHead());
app.use(TippyPlugin);
app.use(Maska);
app.use(VueApexCharts);
app.use(router);

// Provedor de eventBus
app.provide('eventBus', mitt());

app.mount('#app');
