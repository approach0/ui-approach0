import 'babel-polyfill'
import { createApp } from 'vue'
import App from './app.vue'

import 'primevue/resources/primevue.min.css'
import 'primeflex/primeflex.css'

const app = createApp(App)

import InputSwitch from 'primevue/inputswitch'
app.component('InputSwitch', InputSwitch)

import Button from 'primevue/button'
app.component('Button', Button)

import InputText from 'primevue/inputtext'
app.component('InputText', InputText)

import Sidebar from 'primevue/sidebar'
app.component('Sidebar', Sidebar)

import TabView from 'primevue/tabview'
app.component('TabView', TabView)

import TabPanel from 'primevue/tabpanel'
app.component('TabPanel', TabPanel)

import ProgressSpinner from 'primevue/progressspinner'
app.component('ProgressSpinner', ProgressSpinner)

app.mount('#app')
