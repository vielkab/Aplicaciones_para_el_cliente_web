import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import usuarios from '@/assets/data/usuarios.json'
import libros from '@/assets/data/libros.json'
import solicitudes from '@/assets/data/solicitudes.json'
import '@/assets/css/estilo.css'

// 🔹 Inicializar localStorage si no existe
if (!localStorage.getItem('usuarios')) {
  // Inicializar cada usuario con su propio estado de libros
  const usuariosConEstado = usuarios.map(usuario => ({
    ...usuario,
    librosEstado: {} // { isbn: { favorito: bool, lectura: string } }
  }))
  localStorage.setItem('usuarios', JSON.stringify(usuariosConEstado))
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
