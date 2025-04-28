import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 导入 Pinia 和 store
import { createPinia } from 'pinia'

const app = createApp(App)

// 使用 Pinia
app.use(createPinia())

app.use(router)
app.use(ElementPlus)

app.mount('#app')