import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import usuarios from '@/assets/data/usuarios.json'
import libros from '@/assets/data/libros.json'
import solicitudes from '@/assets/data/solicitudes.json'

// 🔹 Inicializar localStorage si no existe
if (!localStorage.getItem('usuarios')) {
  localStorage.setItem('usuarios', JSON.stringify(usuarios))
}
if (!localStorage.getItem('libros')) {
  localStorage.setItem('libros', JSON.stringify(libros))
}
if (!localStorage.getItem('solicitudes')) {
  localStorage.setItem('solicitudes', JSON.stringify(solicitudes))
}

const app = createApp(App)
app.use(router)
app.mount('#app')
