import usuarios from '@/assets/data/usuarios.json'
import { ref } from 'vue'

const usuarioActivo = ref(null)

// Inicializar usuarios en localStorage si no existen
if (!localStorage.getItem('usuarios')) {
  localStorage.setItem('usuarios', JSON.stringify(usuarios))
}

function getUsuario() {
  if (usuarioActivo.value) return usuarioActivo.value
  const stored = localStorage.getItem('usuarioActivo')
  if (stored) {
    usuarioActivo.value = JSON.parse(stored)
    return usuarioActivo.value
  }
  return null
}

// Obtener usuario actualizado desde localStorage (para calificaciones actuales)
function getUsuarioActualizado() {
  const usuarioActual = getUsuario()
  if (!usuarioActual) return null
  
  // Leer datos actualizados desde localStorage
  const usuariosStorage = JSON.parse(localStorage.getItem('usuarios'))
  if (!usuariosStorage) return usuarioActual
  
  const usuarioActualizado = usuariosStorage.find(u => u.id === usuarioActual.id)
  
  if (usuarioActualizado) {
    // 🔹 IMPORTANTE: Actualizar el localStorage también
    usuarioActivo.value = usuarioActualizado
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActualizado))
    return usuarioActualizado
  }
  
  return usuarioActual
}

function login(correo, password) {
  // Primero intenta con localStorage
  let usuarioEncontrado = null
  const almacenados = JSON.parse(localStorage.getItem('usuarios'))
  if (almacenados) {
    usuarioEncontrado = almacenados.find(u => u.correo === correo && u.password === password)
  }
  
  // Si no encuentra en localStorage, busca en el JSON importado
  if (!usuarioEncontrado) {
    usuarioEncontrado = usuarios.find(u => u.correo === correo && u.password === password)
  }
  
  if (!usuarioEncontrado) return null

  usuarioActivo.value = usuarioEncontrado
  localStorage.setItem('usuarioActivo', JSON.stringify(usuarioEncontrado))
  
  // Asegurar que usuarios está en localStorage
  if (!localStorage.getItem('usuarios')) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
  }
  
  return usuarioEncontrado
}

function cerrarSesion() {
  usuarioActivo.value = null
  localStorage.removeItem('usuarioActivo')
}

function getRol() {
  return getUsuario()?.rol
}

export function useAuth() {
  return { login, cerrarSesion, getUsuario, getUsuarioActualizado, getRol }
}
