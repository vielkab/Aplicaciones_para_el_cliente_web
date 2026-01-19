import usuarios from '@/assets/data/usuarios.json'
import { ref } from 'vue'

const usuarioActivo = ref(null)

// inicializacion de usuarios en localStorage si no existen
if (!localStorage.getItem('usuarios')) {
  const usuariosConEstado = usuarios.map(usuario => ({
    ...usuario,
    librosEstado: {},
    calificacionPromedio: usuario.calificacionPromedio || 5
  }))
  localStorage.setItem('usuarios', JSON.stringify(usuariosConEstado))
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

// Obtener usuario actualizado desde localStorage
function getUsuarioActualizado() {
  const usuarioActual = getUsuario()
  if (!usuarioActual) return null
  
  // Leer datos actualizados desde localStorage
  const usuariosStorage = JSON.parse(localStorage.getItem('usuarios'))
  if (!usuariosStorage) return usuarioActual
  
  const usuarioActualizado = usuariosStorage.find(u => u.id === usuarioActual.id)
  
  if (usuarioActualizado) {
    usuarioActivo.value = usuarioActualizado
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActualizado))
    return usuarioActualizado
  }
  
  return usuarioActual
}

function login(correo, password) {
  let usuarioEncontrado = null
  const almacenados = JSON.parse(localStorage.getItem('usuarios'))
  if (almacenados) {
    usuarioEncontrado = almacenados.find(u => u.correo === correo && u.password === password)
  }

  if (!usuarioEncontrado) {
    usuarioEncontrado = usuarios.find(u => u.correo === correo && u.password === password)
  }
  
  if (!usuarioEncontrado) return null

  usuarioActivo.value = usuarioEncontrado
  localStorage.setItem('usuarioActivo', JSON.stringify(usuarioEncontrado))
  
  if (!localStorage.getItem('usuarios')) {
    const usuariosConEstado = usuarios.map(usuario => ({
      ...usuario,
      librosEstado: {},
      calificacionPromedio: usuario.calificacionPromedio || 5
    }))
    localStorage.setItem('usuarios', JSON.stringify(usuariosConEstado))
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

function obtenerEstadoLibro(isbn) {
  const usuario = getUsuarioActualizado()
  if (!usuario) return { favorito: false, lectura: 'NO LEÍDO' }
  
  if (!usuario.librosEstado) {
    usuario.librosEstado = {}
  }
  
  return usuario.librosEstado[isbn] || { favorito: false, lectura: 'NO LEÍDO' }
}

function guardarEstadoLibro(isbn, estado) {
  const usuario = getUsuarioActualizado()
  if (!usuario) return false
  
  if (!usuario.librosEstado) {
    usuario.librosEstado = {}
  }
  
  usuario.librosEstado[isbn] = estado

  const usuariosStorage = JSON.parse(localStorage.getItem('usuarios'))
  const usuarioIdx = usuariosStorage.findIndex(u => u.id === usuario.id)
  if (usuarioIdx !== -1) {
    usuariosStorage[usuarioIdx] = usuario
    localStorage.setItem('usuarios', JSON.stringify(usuariosStorage))
    usuarioActivo.value = usuario
    localStorage.setItem('usuarioActivo', JSON.stringify(usuario))
  }
  
  return true
}

function obtenerLibrosVencidos() {
  const usuario = getUsuarioActualizado()
  if (!usuario) return []
  
  const libros = JSON.parse(localStorage.getItem('libros')) || []
  const ahora = new Date().getTime()
  
  // Encontrar libros del usuario que están vencidos
  return libros.filter(libro => {
    if (libro.usuarioPrestamista !== usuario.id) return false
    if (!libro.fechaDevolucionEsperada) return false
    
    const fechaMs = typeof libro.fechaDevolucionEsperada === 'number' 
      ? libro.fechaDevolucionEsperada 
      : new Date(libro.fechaDevolucionEsperada).getTime()
    
    return fechaMs < ahora && libro.estado !== 'en mora'
  })
}

function marcarLibroEnMora(isbn) {
  const libros = JSON.parse(localStorage.getItem('libros')) || []
  const usuario = getUsuarioActualizado()
  
  if (!usuario) return false
  
  const libro = libros.find(l => l.isbn === isbn)
  if (!libro) return false
  
  libro.estado = 'en mora'
  libro.usuarioEnMora = usuario.id
  libro.fechaEnMora = new Date().getTime()
  
  localStorage.setItem('libros', JSON.stringify(libros))
  
  // Reducir calificación a 0
  usuario.calificacionPromedio = 0
  const usuariosStorage = JSON.parse(localStorage.getItem('usuarios'))
  const usuarioIdx = usuariosStorage.findIndex(u => u.id === usuario.id)
  if (usuarioIdx !== -1) {
    usuariosStorage[usuarioIdx] = usuario
    localStorage.setItem('usuarios', JSON.stringify(usuariosStorage))
    usuarioActivo.value = usuario
    localStorage.setItem('usuarioActivo', JSON.stringify(usuario))
  }
  
  return true
}

function verificarYMarcarLibrosVencidos() {
  const librosVencidos = obtenerLibrosVencidos()
  const alertas = []
  
  librosVencidos.forEach(libro => {
    marcarLibroEnMora(libro.isbn)
    alertas.push({
      tipo: 'mora',
      titulo: libro.titulo,
      mensaje: `El libro "${libro.titulo}" ha vencido. Se ha marcado en mora y tu calificación ha sido reducida a 0.`
    })
  })
  
  return alertas
}

export function useAuth() {
  return { 
    login, 
    cerrarSesion, 
    getUsuario, 
    getUsuarioActualizado, 
    getRol,
    obtenerEstadoLibro,
    guardarEstadoLibro,
    obtenerLibrosVencidos,
    marcarLibroEnMora,
    verificarYMarcarLibrosVencidos
  }
}
