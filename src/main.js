import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // <-- Pastikan import ini ada

const app = createApp(App)

app.use(router) // <-- INI KUNCI UTAMANYA
app.mount('#app')