import { createRouter, createWebHashHistory } from 'vue-router'
import Panel from "./pages/Panel.vue"
import Report from "./pages/Report.vue"
import contribution from "./pages/contribution.vue"
const routes = [
    { path: '/', component: Panel },
    { path: '/report', component: Report },
    { path: '/contribution',component:contribution}
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})