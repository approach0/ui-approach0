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

app.mount('#app')
