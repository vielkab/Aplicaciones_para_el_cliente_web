<template>
  <section class="gestion-libros-fisicos">
    <h2>Libros Físicos - Admin</h2>

    <div class="contenedor-fisicos">
      <!-- Lista de libros físicos -->
      <section class="col-izquierda">
        <h3>Libros físicos</h3>
        <div v-if="librosFisicos.length === 0">No hay libros físicos disponibles.</div>
        <div v-for="libro in librosFisicos" :key="libro.id" class="tarjetas">
          <div class="libro-fisico">
            <img :src="libro.portada" :alt="libro.titulo" />
          </div>
          <div class="info">
            <h3>{{ libro.titulo }}</h3>
            <p><b>Autor:</b> {{ libro.autor }}</p>
            <p><b>ISBN:</b> {{ libro.isbn }}</p>
            <p><b>Estado:</b> 
              <span :class="estadoClase(libro.estado)">
                {{ libro.estado }}
              </span>
            </p>
            <button v-if="libro.estado === 'prestado'" @click="abrirModalCalificacion(libro.id)">
              Marcar como Disponible y Calificar
            </button>
          </div>
        </div>
      </section>

      <!-- Lista de solicitudes pendientes -->
      <section class="col-derecha">
        <h3>Solicitudes pendientes</h3>
        <div v-if="solicitudesPendientes.length === 0">No hay solicitudes pendientes.</div>
        <div v-for="sol in solicitudesPendientes" :key="sol.id" class="solicitud-card">
          <p><b>Libro:</b> {{ obtenerLibro(sol.libroId).titulo }} (ISBN: {{ obtenerLibro(sol.libroId).isbn }})</p>
          <div class="usuario-info">
            <p>
              <b>Usuario:</b> {{ obtenerUsuario(sol.usuarioId).nombre }}
            </p>
            <p class="calificacion-badge">
              ⭐ {{ obtenerUsuario(sol.usuarioId).calificacionPromedio.toFixed(1) }} 
              ({{ obtenerUsuario(sol.usuarioId).totalPrestamos }} préstamos)
            </p>
          </div>
          <p><b>Solicitado:</b> {{ formatearFecha(sol.fechaSolicitud) }}</p>
          <p><b>Plazo:</b> {{ sol.plazoDias }} días</p>

          <div class="acciones-solicitud">
            <button @click="aprobarSolicitud(sol.id)" class="btn-aprobar">Aprobar</button>
            <button @click="rechazarSolicitud(sol.id)" class="btn-rechazar">Rechazar</button>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal de calificación -->
    <CalificacionEstrellas 
      v-if="mostrarModal"
      :nombreUsuario="usuarioACalificar.nombre"
      :calificacionActual="usuarioACalificar.calificacionPromedio"
      :totalPrestamos="usuarioACalificar.totalPrestamos"
      @calificar="procesarCalificacion"
      @cerrar="cerrarModal"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CalificacionEstrellas from '@/components/admin/CalificacionEstrellas.vue'

const libros = ref([])
const usuarios = ref([])
const solicitudes = ref([])

const librosFisicos = ref([])
const solicitudesPendientes = ref(
  JSON.parse(localStorage.getItem('solicitudes'))?.filter(s => s.estado === 'pendiente') || []
)

const mostrarModal = ref(false)
const libroEnDevolucion = ref(null)
const usuarioACalificar = ref({})

function cargarDatos() {
  // Asegurar que usuarios esté en localStorage
  if (!localStorage.getItem('usuarios')) {
    const usuariosDefault = [
      { id: 1, nombre: 'María Quiroz', correo: 'mariaquiroz@uleam.edu.ec', calificacionPromedio: 0, totalPrestamos: 0 },
      { id: 2, nombre: 'Juan Navarrete', correo: 'e1234567890@live.uleam.edu.ec', calificacionPromedio: 0, totalPrestamos: 0 },
      { id: 3, nombre: 'Miguel Carrasco', correo: 'miguel.carrasco@uleam.edu.ec', calificacionPromedio: 0, totalPrestamos: 0 }
    ]
    localStorage.setItem('usuarios', JSON.stringify(usuariosDefault))
  }
  
  usuarios.value = JSON.parse(localStorage.getItem('usuarios')) || []
  libros.value = JSON.parse(localStorage.getItem('libros')) || []
  solicitudes.value = JSON.parse(localStorage.getItem('solicitudes')) || []

  librosFisicos.value = libros.value.filter(l => l.tipolibro === 'Fisico')
  solicitudesPendientes.value = solicitudes.value.filter(s => s.estado === 'pendiente')
}

function resetearDatos() {
  if (confirm('⚠️ Esto borrará TODOS los datos del localStorage. ¿Estás seguro?')) {
    localStorage.removeItem('libros')
    localStorage.removeItem('usuarios')
    localStorage.removeItem('solicitudes')
    console.log('🗑️ Todos los datos de localStorage han sido eliminados')
    alert('✅ Datos eliminados. Recarga la página para que aparezcan los datos iniciales.')
  }
}

function obtenerUsuario(id) {
  let almacenados = JSON.parse(localStorage.getItem('usuarios'))
  
  // Si localStorage está vacío, intenta inicializar desde JSON
  if (!almacenados || almacenados.length === 0) {
    // Importar usuarios del JSON estático
    const usuariosDefault = [
      { id: 1, nombre: 'María Quiroz', calificacionPromedio: 0, totalPrestamos: 0 },
      { id: 2, nombre: 'Juan Navarrete', calificacionPromedio: 0, totalPrestamos: 0 },
      { id: 3, nombre: 'Miguel Carrasco', calificacionPromedio: 0, totalPrestamos: 0 }
    ]
    almacenados = usuariosDefault
  }
  
  const usuario = almacenados.find(u => u.id === id)
  const resultado = usuario || { nombre: 'Desconocido', calificacionPromedio: 0, totalPrestamos: 0 }
  console.log(`📋 obtenerUsuario(${id}):`, resultado)
  return resultado
}

function obtenerLibro(id) {
  return libros.value.find(l => l.id === id) || { titulo: 'Desconocido', isbn: 'N/A' }
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString()
}

function estadoClase(estado) {
  return { 'disponible': 'estado-disponible', 'prestado': 'estado-prestado' }[estado] || ''
}

function aprobarSolicitud(id) {
  const s = solicitudes.value.find(s => s.id === id)
  const libro = obtenerLibro(s.libroId)
  
  // Verificar que el libro no esté ya prestado
  if(libro.estado === 'prestado') {
    alert('Libro ya prestado')
    return
  }
  
  // Actualizar solicitud
  s.estado = 'aprobada'
  s.codigoRetiro = Math.random().toString(36).substring(2,8).toUpperCase()
  
  // Actualizar estado del libro
  libro.estado = 'prestado'
  
  // Guardar inmediatamente en localStorage
  localStorage.setItem('libros', JSON.stringify(libros.value))
  localStorage.setItem('solicitudes', JSON.stringify(solicitudes.value))
  
  // Recargar datos para sincronizar estado
  cargarDatos()
  alert(`Aprobada. Código: ${s.codigoRetiro}`)
}

function rechazarSolicitud(id) {
  const motivo = prompt('Motivo del rechazo:')
  if(!motivo) return
  const s = solicitudes.value.find(s => s.id === id)
  s.estado='rechazada'
  s.motivo=motivo
  s.mensajeVisto=false
  guardarDatos()
  cargarDatos()
}

// Abrir modal para calificar al usuario
function abrirModalCalificacion(libroId) {
  const libro = obtenerLibro(libroId)
  if(!confirm(`Confirmar devolución de "${libro.titulo}"?`)) return
  
  console.log('📌 Buscando solicitud para libroId:', libroId)
  console.log('📌 Solicitudes disponibles:', solicitudes.value)
  
  const solicitud = solicitudes.value.find(s => s.libroId === libroId && s.estado === 'aprobada')
  
  if(solicitud){
    console.log('✅ Solicitud encontrada:', solicitud)
    libroEnDevolucion.value = libroId
    // Obtener usuario actualizado del localStorage
    usuarioACalificar.value = obtenerUsuario(solicitud.usuarioId)
    mostrarModal.value = true
    console.log('✅ Modal abierto')
  } else {
    console.log('❌ No se encontró solicitud aprobada para este libro')
    alert('Error: No se encontró una solicitud aprobada para este libro')
  }
}

// Procesar la calificación del modal
function procesarCalificacion(calificacion) {
  console.log('🔄 Procesando calificación:', calificacion)
  console.log('📌 libroEnDevolucion.value:', libroEnDevolucion.value)
  
  const libro = obtenerLibro(libroEnDevolucion.value)
  console.log('📖 Libro encontrado:', libro)
  
  const solicitud = solicitudes.value.find(s=>s.libroId===libroEnDevolucion.value && s.estado==='aprobada')
  console.log('📋 Solicitud encontrada:', solicitud)

  if (!libro || !solicitud) {
    alert('Error: No se encontró el libro o la solicitud')
    console.log('❌ Error: libro o solicitud no encontrados')
    return
  }

  // Marcar libro como disponible
  console.log('📝 Cambiando estado del libro a "disponible"')
  libro.estado = 'disponible'
  console.log('✅ Nuevo estado del libro:', libro.estado)

  // Actualizar solicitud como completada
  solicitud.estado='completada'
  solicitud.fechaDevolucion = new Date().toISOString()

  // Obtener usuario de localStorage y actualizar calificación
  const usuariosStorage = JSON.parse(localStorage.getItem('usuarios'))
  if (!usuariosStorage) {
    alert('Error: No hay datos de usuarios en localStorage')
    return
  }
  
  const usuarioIndex = usuariosStorage.findIndex(u => u.id === solicitud.usuarioId)
  console.log('👤 Usuario index:', usuarioIndex)
  
  if (usuarioIndex !== -1) {
    const usuario = usuariosStorage[usuarioIndex]
    
    // Inicializar si no tienen valores
    if (!usuario.calificacionPromedio) usuario.calificacionPromedio = 0
    if (!usuario.totalPrestamos) usuario.totalPrestamos = 0
    
    // Calcular nueva calificación promedio
    const calificacionPromediaAnterior = usuario.calificacionPromedio * usuario.totalPrestamos
    const nuevaCalificacion = (calificacionPromediaAnterior + calificacion) / (usuario.totalPrestamos + 1)
    
    usuario.calificacionPromedio = nuevaCalificacion
    usuario.totalPrestamos++
    
    // Actualizar también en usuarios.value para mantener sincronización
    const usuarioEnState = usuarios.value.find(u => u.id === usuario.id)
    if (usuarioEnState) {
      usuarioEnState.calificacionPromedio = usuario.calificacionPromedio
      usuarioEnState.totalPrestamos = usuario.totalPrestamos
    }
    
    console.log('✅ Usuario actualizado:', usuario)
    console.log('📊 Nueva calificación:', usuario.calificacionPromedio.toFixed(2))
    console.log('📈 Total préstamos:', usuario.totalPrestamos)
  }

  // Guardar todo en localStorage (sincronizar de forma definitiva)
  console.log('💾 Guardando en localStorage...')
  localStorage.setItem('libros', JSON.stringify(libros.value))
  localStorage.setItem('solicitudes', JSON.stringify(solicitudes.value))
  localStorage.setItem('usuarios', JSON.stringify(usuariosStorage))
  
  console.log('✔️ Datos guardados en localStorage')
  
  // Recargar datos desde localStorage para asegurar sincronización perfecta
  cargarDatos()
  cerrarModal()
  alert(`Usuario calificado con ${calificacion} ⭐`)
}

function cerrarModal() {
  mostrarModal.value = false
  libroEnDevolucion.value = null
  usuarioACalificar.value = {}
}

function guardarDatos() {
  localStorage.setItem('libros', JSON.stringify(libros.value))
  localStorage.setItem('usuarios', JSON.stringify(usuarios.value))
  localStorage.setItem('solicitudes', JSON.stringify(solicitudes.value))
  
  // Actualizar solicitudes pendientes desde localStorage para que Vue las recargue
  solicitudesPendientes.value = JSON.parse(localStorage.getItem('solicitudes')).filter(s => s.estado === 'pendiente')
}


onMounted(()=>{cargarDatos()})
</script>

<style scoped>
.gestion-libros-fisicos { padding:20px }
.contenedor-fisicos { display:flex; gap:30px }
.col-izquierda, .col-derecha { flex:1 }
.tarjetas { display:flex; gap:10px; margin-bottom:15px; background:#f4f3ef; border-radius:8px; padding:10px }
.libro-fisico img { width:120px; height:160px; object-fit:cover }
.info { flex:1 }
.info h3 { margin: 0 0 8px 0; }
.info p { margin: 5px 0; font-size: 0.9em; }
.info button { 
  margin-top: 8px;
  padding: 8px 12px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}
.info button:hover { background: #1976D2; }
.estado-disponible { color:#fff; background:#4caf50; padding:2px 6px; border-radius:6px }
.estado-prestado { color:#fff; background:#f44336; padding:2px 6px; border-radius:6px }

.solicitud-card { background:#fef9e7; padding:15px; margin-bottom:15px; border-radius:8px; border-left: 4px solid #ffc107; }
.solicitud-card p { margin: 8px 0; font-size: 0.95em; }

.usuario-info {
  background: #fff;
  padding: 10px;
  border-radius: 6px;
  margin: 10px 0;
  border-left: 3px solid #2196F3;
}

.calificacion-badge {
  color: #ff9800;
  font-weight: bold;
  font-size: 1em;
}

.acciones-solicitud {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.btn-aprobar, 
.btn-rechazar { 
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  flex: 1;
}

.btn-aprobar {
  background: #4caf50;
  color: white;
}

.btn-aprobar:hover {
  background: #45a049;
}

.btn-rechazar {
  background: #f44336;
  color: white;
}

.btn-rechazar:hover {
  background: #da190b;
}
</style>
