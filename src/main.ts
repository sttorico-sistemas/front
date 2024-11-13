import 'public/assets/css/app.css'

import App from './App.vue'
import { createApp } from 'vue'
import router from './core/router'
import { createHead } from '@vueuse/head'
import mitt from 'mitt'
import DefaultLayout from './core/layouts/DefaultLayout.vue'
import AppLayout from './core/layouts/AppLayout.vue'
import { TippyPlugin } from 'tippy.vue'
import Maska from 'maska'
import VueApexCharts from 'vue3-apexcharts'
import Popper from 'vue3-popper'
import JsonExcel from 'vue-json-excel3'
import Multiselect from '@suadelabs/vue3-multiselect'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.component('default-layout', DefaultLayout);
app.component('app-layout', AppLayout);
app.component('Popper', Popper)
app.component('DownloadExcel', JsonExcel)
app.component('Multiselect', Multiselect)

app.use(pinia)
app.use(createHead())
app.use(TippyPlugin)
app.use(Maska)
app.use(VueApexCharts)
app.use(router)

app.provide('eventBus', mitt())

app.mount('#app')
