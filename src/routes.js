import { createRouter, createWebHashHistory } from 'vue-router'
import Panel from "./pages/Panel.vue"
import Report from "./pages/Report.vue"

const routes = [
    { path: '/', component: Panel },
    { path: '/report', component: Report },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})