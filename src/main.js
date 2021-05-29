import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import { store } from './store.js';
import router from "./routes.js"
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import zoomPlugin from 'chartjs-plugin-zoom'


const app = createApp(App)
app.use(ElementPlus)
app.use(store)
app.use(router)

app.use(Vue3ChartJs, {
    plugins: [
      zoomPlugin
    ]
  })

app.mount('#app')
