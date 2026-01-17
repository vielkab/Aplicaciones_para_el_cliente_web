<template>
  <section class="libros-fisicos-user">
    <h2>Libros Físicos</h2>

    <div v-if="librosFisicos.length === 0">No hay libros físicos disponibles.</div>

    <div class="tarjetas">
      <div v-for="libro in librosFisicos" :key="libro.id" class="libro-card">
        <img :src="libro.portada" :alt="libro.titulo" />
        <div class="info">
          <h3>{{ libro.titulo }}</h3>
          <p><b>Autor:</b> {{ libro.autor }}</p>
          <p><b>ISBN:</b> {{ libro.isbn }}</p>
          <p><b>Estado:</b>
            <span :class="estadoClase(libro.estado)">{{ libro.estado }}</span>
          </p>

          <!-- Solicitar préstamo -->
          <div v-if="libro.estado === 'disponible' && !tieneSolicitudActiva(libro.id)">
            <label for="dias">Días de préstamo:</label>
            <select v-model="diasSeleccionados[libro.id]">
              <option value="7">7 días</option>
              <option value="15">15 días</option>
              <option value="30">30 días</option>
            </select>
            <button @click="solicitarPrestamo(libro.id)">Solicitar Préstamo</button>
          </div>

          <!-- Mostrar solicitud pendiente -->
          <div v-if="solicitudPendiente(libro.id)">
            <p>Solicitud pendiente...</p>
          </div>

          <!-- Mostrar código de retiro si aprobada -->
          <div v-if="solicitudAprobada(libro.id)">
            <p><b>Código de retiro:</b> {{ obtenerCodigoRetiro(libro.id) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { getUsuario } = useAuth()

// Usuario actual obtenido desde Auth
const usuarioActual = ref(getUsuario() || { id: 2, correo: 'e1234567890@live.uleam.edu.ec' })

const libros = ref([])
const solicitudes = ref([])

const librosFisicos = ref([])
const diasSeleccionados = ref({})

// Cargar datos de localStorage
function cargarDatos() {
  usuarioActual.value = getUsuario() // Recarga el usuario actualizado
  libros.value = JSON.parse(localStorage.getItem('libros')) || []
  solicitudes.value = JSON.parse(localStorage.getItem('solicitudes')) || []

  librosFisicos.value = libros.value.filter(l => l.tipolibro === 'Fisico')
  
  // 🔹 MOSTRAR MOTIVO DE RECHAZO UNA SOLA VEZ CON ALERT
  verificarRechazos()
}

// 🔹 NUEVA FUNCIÓN: Verificar y mostrar rechazos pendientes
function verificarRechazos() {
  const rechazosNoVistos = solicitudes.value.filter(
    s => s.libroId && 
         s.usuarioId === usuarioActual.value.id && 
         s.estado === 'rechazada' && 
         !s.mensajeVisto
  )
  
  rechazosNoVistos.forEach(rechazo => {
    const libro = libros.value.find(l => l.id === rechazo.libroId)
    if (libro) {
      alert(`❌ Tu solicitud para "${libro.titulo}" fue rechazada.\n\nMotivo: ${rechazo.motivo}`)
      // Marcar como visto
      rechazo.mensajeVisto = true
      guardarDatos()
    }
  })
}

// Helpers
function estadoClase(estado) {
  return {
    'disponible': 'estado-disponible',
    'prestado': 'estado-prestado'
  }[estado] || ''
}

function tieneSolicitudActiva(libroId) {
  return solicitudes.value.some(s => s.libroId === libroId && s.usuarioId === usuarioActual.value.id && (s.estado === 'pendiente' || s.estado === 'aprobada'))
}

function solicitudPendiente(libroId) {
  return solicitudes.value.find(s => s.libroId === libroId && s.usuarioId === usuarioActual.value.id && s.estado === 'pendiente')
}

function solicitudAprobada(libroId) {
  return solicitudes.value.find(s => s.libroId === libroId && s.usuarioId === usuarioActual.value.id && s.estado === 'aprobada')
}

function obtenerCodigoRetiro(libroId) {
  const sol = solicitudAprobada(libroId)
  return sol ? sol.codigoRetiro : ''
}

// Solicitar préstamo
function solicitarPrestamo(libroId) {
  const libro = libros.value.find(l => l.id === libroId)
  if (!libro || libro.estado !== 'disponible') return

  const dias = diasSeleccionados.value[libroId] || 7
  const idSolicitud = Date.now() // id único
  solicitudes.value.push({
    id: idSolicitud,
    libroId,
    usuarioId: usuarioActual.value.id,
    fechaSolicitud: new Date().toISOString(),
    plazoDias: dias,
    estado: 'pendiente',
    codigoRetiro: null,
    motivo: null,
    mensajeVisto: false
  })

  guardarDatos()
  cargarDatos()
  alert('Solicitud enviada al admin')
}

// Guardar en localStorage
function guardarDatos() {
  localStorage.setItem('solicitudes', JSON.stringify(solicitudes.value))
  localStorage.setItem('libros', JSON.stringify(libros.value))
}

// Inicializar
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.libros-fisicos-user {
  padding: 20px;
}

.tarjetas {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.libro-card {
  width: 220px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background: #fdfdfd;
}

.libro-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  margin-bottom: 10px;
}

.info p {
  margin: 4px 0;
}

.estado-disponible {
  color: #fff;
  background-color: #4caf50;
  padding: 2px 6px;
  border-radius: 6px;
}

.estado-prestado {
  color: #fff;
  background-color: #f44336;
  padding: 2px 6px;
  border-radius: 6px;
}

button {
  margin-top: 5px;
  padding: 5px 8px;
  background-color: #b50505;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #a20404;
}

select {
  margin-top: 5px;
}
</style>
