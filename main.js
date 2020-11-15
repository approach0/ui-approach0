import 'babel-polyfill'
import { createApp } from 'vue'
import App from './app.vue'

import 'primevue/resources/primevue.min.css'
import 'primeflex/primeflex.css'

const app = createApp(App)

import InputSwitch from 'primevue/inputswitch'
app.component('InputSwitch', InputSwitch)

import InputText from 'primevue/inputtext'
app.component('InputText', InputText)

import Button from 'primevue/button'
app.component('Button', Button)

import Toolbar from 'primevue/toolbar'
app.component('Toolbar', Toolbar)

app.mount('#app')
