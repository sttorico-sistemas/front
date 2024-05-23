import './assets/css/app.css'

import App from './App.vue'
import { createApp } from 'vue'
import router from './router'

const app = createApp(App)

//vue-meta
import { createHead } from '@vueuse/head'
const head = createHead()
app.use(head)

// tippy tooltips
import { TippyPlugin } from 'tippy.vue'
app.use(TippyPlugin)

//input mask
import Maska from 'maska';
app.use(Maska);

// ApexCharts
import VueApexCharts from 'vue3-apexcharts'
app.use(VueApexCharts)

// popper
import Popper from 'vue3-popper'
app.component('Popper', Popper)

// json to excel
import JsonExcel from 'vue-json-excel3'
app.component('DownloadExcel', JsonExcel)

// Multiselect
import Multiselect from '@suadelabs/vue3-multiselect'
app.component('Multiselect', Multiselect)

// Mitt
import mitt from 'mitt'
const emitter = mitt()
app.provide('eventBus', emitter)

app.use(router)

app.mount('#app')
