<template>
  <section class="libros-fisicos-user">
    <h2>Libros Físicos</h2>

    <!-- Libros que tiene prestados -->
    <div v-if="librosPrestados.length > 0" class="seccion-prestados">
      <h3>Mis Préstamos Activos</h3>
      <div class="tarjetas">
        <div v-for="libro in librosPrestados" :key="libro.id" class="libro-card prestado">
          <img :src="libro.portada" :alt="libro.titulo" />
          <div class="info">
            <h3>{{ libro.titulo }}</h3>
            <p><b>Autor:</b> {{ libro.autor }}</p>
            <p><b>ISBN:</b> {{ libro.isbn }}</p>
            <p v-if="obtenerCodigoRetiro(libro.id) !== null"><b>Código de retiro:</b> {{ obtenerCodigoRetiro(libro.id) }}</p>
            <p class="tiempo-restante"><b>Devolución en:</b> {{ diasRestantes(libro.fechaDevolucionEsperada) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Libros disponibles -->
    <div>
      <h3>Libros Disponibles</h3>
      <div v-if="librosDisponibles.length === 0">No hay libros físicos disponibles.</div>

      <div class="tarjetas">
        <div v-for="libro in librosDisponibles" :key="libro.id" class="libro-card">
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
              <p>⏳ Solicitud pendiente de aprobación...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { getUsuario } = useAuth()

// Usuario actual obtenido desde Auth
const usuarioActual = ref(getUsuario() || { id: 2, correo: 'e1234567890@live.uleam.edu.ec' })

const libros = ref([])
const solicitudes = ref([])
const diasSeleccionados = ref({})

// Computed para libros prestados y disponibles
const librosPrestados = computed(() => {
  return libros.value.filter(l => 
    l.tipolibro === 'Fisico' && 
    l.estado === 'prestado' && 
    l.usuarioPrestamista
  )
})

const librosDisponibles = computed(() => {
  return libros.value.filter(l => 
    l.tipolibro === 'Fisico' && 
    l.estado === 'disponible'
  )
})

// Cargar datos de localStorage
function cargarDatos() {
  usuarioActual.value = getUsuario() // Recarga el usuario actualizado
  libros.value = JSON.parse(localStorage.getItem('libros')) || []
  solicitudes.value = JSON.parse(localStorage.getItem('solicitudes')) || []
  
  verificarRechazos()
}

// Función para calcular días y horas restantes
function diasRestantes(fechaDevolucionEsperada) {
  if (!fechaDevolucionEsperada) return '-'
  
  const ahora = new Date()
  // Maneja tanto timestamps (números) como fechas ISO (strings)
  const fechaMs = typeof fechaDevolucionEsperada === 'number' 
    ? fechaDevolucionEsperada 
    : new Date(fechaDevolucionEsperada).getTime()
  
  const diferencia = fechaMs - ahora.getTime()
  
  if (diferencia <= 0) return 'Vencido'
  
  const totalMinutos = Math.floor(diferencia / (1000 * 60))
  const dias = Math.floor(totalMinutos / (60 * 24))
  const horas = Math.floor((totalMinutos % (60 * 24)) / 60)
  const minutos = totalMinutos % 60
  
  let resultado = ''
  if (dias > 0) resultado += `${dias}d `
  if (horas > 0 || dias > 0) resultado += `${horas}h `
  resultado += `${minutos}m`
  
  return resultado.trim()
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
  return solicitudes.value.some(s => s.libroId === libroId && s.usuarioId === usuarioActual.value.id && s.estado === 'pendiente')
}

function solicitudPendiente(libroId) {
  return solicitudes.value.find(s => s.libroId === libroId && s.usuarioId === usuarioActual.value.id && s.estado === 'pendiente')
}

function solicitudAprobada(libroId) {
  return solicitudes.value.find(s => s.libroId === libroId && s.usuarioId === usuarioActual.value.id && s.estado === 'aprobada')
}

function obtenerCodigoRetiro(libroId) {
  const sol = solicitudAprobada(libroId)
  return sol ? sol.codigoRetiro : null
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
  // Actualizar datos cada 2 segundos para reflejar cambios en tiempo real
  setInterval(() => {
    cargarDatos()
  }, 2000)
})
</script>

<style scoped>
h2 {
  font-size: 1.7em;
  color: #ba0707;
}

h3 {
  color: #ba0707;
  margin-top: 20px;
  margin-bottom: 15px;
}

.libros-fisicos-user {
  padding: 20px;
}

.seccion-prestados {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 30px;
  border-left: 4px solid #ffc107;
}

.tarjetas {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.libro-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  width: 220px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.libro-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.libro-card.prestado {
  background: #fff9e6;
  border-left: 3px solid #ffc107;
}

.libro-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

.info {
  font-size: 0.85em;
}

.info h3 {
  margin: 8px 0;
  font-size: 1em;
  color: #333;
}

.info p {
  margin: 5px 0;
  font-size: 0.8em;
}

.tiempo-restante {
  color: #f57c00;
  font-weight: bold;
  background: #fff3e0;
  padding: 5px;
  border-radius: 4px;
}

.estado-disponible {
  color: #fff;
  background: #4caf50;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
}

.estado-prestado {
  color: #fff;
  background: #f44336;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
}

label {
  font-size: 0.8em;
  display: block;
  margin-top: 8px;
}

select, button {
  font-size: 0.8em;
  padding: 4px 8px;
  margin-top: 4px;
  border-radius: 4px;
  border: 1px solid #ddd;
  width: 100%;
  cursor: pointer;
}

button {
  background: #ba0707;
  color: white;
  border: none;
  margin-top: 8px;
  font-weight: bold;
  transition: background 0.2s;
}

button:hover {
  background: #8a0505;
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


