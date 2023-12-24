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

// popper
import Popper from 'vue3-popper'
app.component('Popper', Popper)

// json to excel
import vue3JsonExcel from 'vue3-json-excel'
app.use(vue3JsonExcel)

app.use(router)

app.mount('#app')
