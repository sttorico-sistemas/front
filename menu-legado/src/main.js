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

app.use(router)

app.mount('#app')
