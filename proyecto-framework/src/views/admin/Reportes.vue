<template>
  <section class="reportes-admin">
    <h2>Resumen General y Estadísticas</h2>
    <button @click="generarEstadisticas">Recalcular Estadísticas</button>

    <div id="resumen-libros">
      <!-- Estadísticas principales -->
      <div class="stats-grid">
        <div class="stat-card total-general">
          <h3>Total de Libros (Físicos + Virtuales)</h3>
          <p>{{ totalLibros }}</p>
        </div>

        <div class="stat-card virtuales">
          <h3>Libros Virtuales</h3>
          <p>{{ totalVirtuales }}</p>
        </div>

        <div class="stat-card fisicos">
          <h3>Libros Físicos</h3>
          <p>{{ totalFisicos }}</p>
        </div>

        <div class="stat-card disponible">
          <h3>Físicos Disponibles</h3>
          <p>{{ fisicosDisponibles }}</p>
        </div>

        <div class="stat-card prestado">
          <h3>Físicos Prestados</h3>
          <p>{{ fisicosPrestados }}</p>
        </div>

        <div class="stat-card solicitudes">
          <h3>Solicitudes Pendientes</h3>
          <p>{{ solicitudesPendientes }}</p>
        </div>
      </div>

      <!-- Progreso de lectura -->
      <h4>Progreso de Lectura (Virtuales Leídos)</h4>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" :style="{ width: porcentajeLeidos + '%' }">
          {{ porcentajeLeidos }}% ({{ totalLeidos }} de {{ totalVirtuales }})
        </div>
      </div>

      <!-- Tabla de libros leídos con conteo simulado -->
      <h4 style="margin-top: 30px;">Libros Leídos con Conteo (Simulado)</h4>
      <table class="reporte-tabla">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Nro. Lecturas (Sim.)</th>
            <th>Nro. Descargas (Sim.)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="librosParaTabla.length === 0">
            <td colspan="4">Aún no hay libros virtuales marcados como 'leídos'.</td>
          </tr>
          <tr v-for="libro in librosParaTabla" :key="libro.isbn">
            <td>{{ libro.titulo }}</td>
            <td>{{ libro.autor }}</td>
            <td>{{ libro.lecturas }}</td>
            <td>{{ libro.descargas }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// --- Datos reactivos ---
const libros = ref([])
const solicitudes = ref([])

// Estadísticas
const totalLibros = ref(0)
const totalVirtuales = ref(0)
const totalFisicos = ref(0)
const fisicosDisponibles = ref(0)
const fisicosPrestados = ref(0)
const solicitudesPendientes = ref(0)
const totalLeidos = ref(0)
const porcentajeLeidos = ref(0)
const librosParaTabla = ref([])

// --- Funciones para cargar datos ---
function cargarDatos() {
  libros.value = JSON.parse(localStorage.getItem('libros')) || []
  solicitudes.value = JSON.parse(localStorage.getItem('solicitudes')) || []
}

// --- Función para generar estadísticas ---
function generarEstadisticas() {
  cargarDatos()

  totalLibros.value = libros.value.length
  const librosVirtuales = libros.value.filter(l => l.tipolibro === 'Virtual')
  totalVirtuales.value = librosVirtuales.length
  const librosFisicos = libros.value.filter(l => l.tipolibro === 'Fisico')
  totalFisicos.value = librosFisicos.length

  fisicosDisponibles.value = librosFisicos.filter(l => l.estado === 'disponible' || l.estado === 'libre').length
  fisicosPrestados.value = librosFisicos.filter(l => l.estado === 'prestado').length

  totalLeidos.value = librosVirtuales.filter(l => l.lectura === 'leido').length
  porcentajeLeidos.value = totalVirtuales.value > 0 ? ((totalLeidos.value / totalVirtuales.value) * 100).toFixed(1) : 0

  // Simulación de lecturas y descargas
  librosParaTabla.value = librosVirtuales
    .filter(l => l.lectura === 'leido')
    .map(l => {
      const seed = parseInt(l.isbn.slice(-3)) || 1
      return {
        titulo: l.titulo,
        autor: l.autor,
        isbn: l.isbn,
        lecturas: 1 + (seed % 5),
        descargas: seed % 4
      }
    })

  // Conteo de solicitudes pendientes
  solicitudesPendientes.value = solicitudes.value.filter(s => s.estado === 'pendiente').length
}


onMounted(() => {
  generarEstadisticas()
})
</script>

<style scoped>
.reportes-admin {
  padding: 0px;
  margin-left: 2%;
}

button {
  color: #ffffff;
  background-color: rgb(195, 7, 7);
  border: none;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 20px;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.stat-card h3 {
  font-size: 0.9em;
  color: #6c757d;
  margin-bottom: 5px;
}

.stat-card p {
  font-size: 2em;
  font-weight: bold;
  margin: 0;
}

.progress-bar-container {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin: 15px 0;
  height: 30px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: #28a745; 
  text-align: right;
  padding-right: 10px;
  line-height: 30px;
  color: white;
  font-weight: bold;
  transition: width 0.5s;
  min-width: 35px;
  box-sizing: border-box;
}

.reporte-tabla {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  font-size: 0.95em;
}

.reporte-tabla th, .reporte-tabla td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.reporte-tabla th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
}

.reporte-tabla td:nth-child(3), 
.reporte-tabla td:nth-child(4) {
  text-align: center;
}
</style>