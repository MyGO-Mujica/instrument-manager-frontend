import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import './style.css'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
app.use(createPinia())
app.use(Antd)
app.use(router)

// Global error handler for Vue runtime errors
app.config.errorHandler = (err, _instance, _info) => {
  console.error('Unhandled error:', err)
}

// Restore auth state from localStorage before mounting
const authStore = useAuthStore()
authStore.loadFromStorage()

app.mount('#app')
