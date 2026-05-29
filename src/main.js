import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'
import './assets/css/main.css'

const app = createApp(App)

// Pinia for state management
app.use(createPinia())

// Vue Router for navigation
app.use(router)

app.mount('#app')
