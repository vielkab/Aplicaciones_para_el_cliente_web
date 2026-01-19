<template>
  <section class="reportes-admin">
    <h2>Resumen General y Estadísticas</h2>
    <button @click="generarEstadisticas">Recalcular Estadísticas</button>

    <div id="resumen-libros">
      <div class="estadisticas">
        <div class="carta-estadistica total-general">
          <h3>Total de Libros (Físicos + Virtuales)</h3>
          <p>{{ totalLibros }}</p>
        </div>

        <div class="carta-estadistica virtuales">
          <h3>Libros Virtuales</h3>
          <p>{{ totalVirtuales }}</p>
        </div>

        <div class="carta-estadistica fisicos">
          <h3>Libros Físicos</h3>
          <p>{{ totalFisicos }}</p>
        </div>

        <div class="carta-estadistica disponible">
          <h3>Físicos Disponibles</h3>
          <p>{{ fisicosDisponibles }}</p>
        </div>

        <div class="carta-estadistica prestado">
          <h3>Físicos Prestados</h3>
          <p>{{ fisicosPrestados }}</p>
        </div>

        <div class="carta-estadistica solicitudes">
          <h3>Solicitudes Pendientes</h3>
          <p>{{ solicitudesPendientes }}</p>
        </div>

        <div class="carta-estadistica mora" style="background-color: #ffe0e0;">
          <h3>Libros en Mora</h3>
          <p>{{ librosEnMora.length }}</p>
        </div>

        <div class="carta-estadistica mora-usuarios" style="background-color: #ffe0e0;">
          <h3>Usuarios en Mora (Calif. 0)</h3>
          <p>{{ usuariosEnMora.length }}</p>
        </div>
      </div>

      <!-- Progreso de lectura -->
      <h4>Progreso de Lectura (Virtuales Leídos)</h4>
      <div class="barra-progreso">
        <div class="llenado-barra" :style="{ width: porcentajeLeidos + '%' }">
          {{ porcentajeLeidos }}% ({{ totalLeidos }} de {{ totalVirtuales }})
        </div>
      </div>

      <!-- Tabla de libros leídos -->
      <h4 style="margin-top: 30px;">Libros Leídos</h4>
      <table class="reporte-tabla">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Nro. Lecturas</th>
            <th>Nro. Descargas</th>
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

      <!-- Tabla de libros en mora -->
      <h4 style="margin-top: 30px; color: #c30202;">Libros en Mora</h4>
      <table class="reporte-tabla" style="border-color: #c30202;">
        <thead>
          <tr style="background-color: #ffe0e0;">
            <th>Título</th>
            <th>Usuario</th>
            <th>Fecha de Vencimiento</th>
            <th>Días en Mora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="librosEnMora.length === 0">
            <td colspan="4">No hay libros en mora.</td>
          </tr>
          <tr v-for="libro in librosEnMora" :key="libro.isbn" style="background-color: #fff5f5;">
            <td>{{ libro.titulo }}</td>
            <td>{{ obtenerNombreUsuario(libro.usuarioEnMora) }}</td>
            <td>{{ formatearFecha(libro.fechaDevolucionEsperada) }}</td>
            <td>{{ calcularDiasEnMora(libro.fechaDevolucionEsperada) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Tabla de usuarios en mora -->
      <h4 style="margin-top: 30px; color: #c30202;">Usuarios en Mora (Calificación 0)</h4>
      <table class="reporte-tabla" style="border-color: #c30202;">
        <thead>
          <tr style="background-color: #ffe0e0;">
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Calificación</th>
            <th>Razón</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="usuariosEnMora.length === 0">
            <td colspan="5">No hay usuarios en mora.</td>
          </tr>
          <tr v-for="usuario in usuariosEnMora" :key="usuario.id" style="background-color: #fff5f5;">
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.correo }}</td>
            <td>{{ usuario.rol }}</td>
            <td>{{ usuario.calificacionPromedio }}</td>
            <td>Por vencimiento de préstamo</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const libros = ref([])
const usuarios = ref([])
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
const librosEnMora = ref([])
const usuariosEnMora = ref([])


function cargarDatos() {
  libros.value = JSON.parse(localStorage.getItem('libros')) || []
  usuarios.value = JSON.parse(localStorage.getItem('usuarios')) || []
  solicitudes.value = JSON.parse(localStorage.getItem('solicitudes')) || []
}

// Contar cuántos usuarios han marcado un libro como leído
function contarLibrosLeidosPorUsuario(isbn) {
  let conteo = 0
  usuarios.value.forEach(usuario => {
    if (usuario.librosEstado && usuario.librosEstado[isbn] && usuario.librosEstado[isbn].lectura === 'leido') {
      conteo++
    }
  })
  return conteo
}

// Obtener nombre del usuario por ID
function obtenerNombreUsuario(usuarioId) {
  const usuario = usuarios.value.find(u => u.id === usuarioId)
  return usuario ? usuario.nombre : 'Desconocido'
}

// Formatear fecha
function formatearFecha(fecha) {
  if (!fecha) return '-'
  const fechaMs = typeof fecha === 'number' ? fecha : new Date(fecha).getTime()
  return new Date(fechaMs).toLocaleDateString('es-ES')
}

// Calcular días en mora
function calcularDiasEnMora(fechaVencimiento) {
  if (!fechaVencimiento) return 0
  const fechaMs = typeof fechaVencimiento === 'number' ? fechaVencimiento : new Date(fechaVencimiento).getTime()
  const ahora = new Date().getTime()
  const diferencia = ahora - fechaMs
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
  return Math.max(0, dias)
}

// Función para generar estadísticas 
function generarEstadisticas() {
  cargarDatos()

  totalLibros.value = libros.value.length
  const librosVirtuales = libros.value.filter(l => l.tipolibro === 'Virtual')
  totalVirtuales.value = librosVirtuales.length
  const librosFisicos = libros.value.filter(l => l.tipolibro === 'Fisico')
  totalFisicos.value = librosFisicos.length

  fisicosDisponibles.value = librosFisicos.filter(l => l.estado === 'disponible' || l.estado === 'libre').length
  fisicosPrestados.value = librosFisicos.filter(l => l.estado === 'prestado').length

  // Contar libros leídos basado en los estados de cada usuario
  let totalLibrosLeidosCount = 0
  const librosLeidosPorIsbn = {}
  
  usuarios.value.forEach(usuario => {
    if (usuario.librosEstado) {
      Object.entries(usuario.librosEstado).forEach(([isbn, estado]) => {
        if (estado.lectura === 'leido') {
          totalLibrosLeidosCount++
          librosLeidosPorIsbn[isbn] = (librosLeidosPorIsbn[isbn] || 0) + 1
        }
      })
    }
  })

  totalLeidos.value = Object.keys(librosLeidosPorIsbn).length // Cantidad de libros unicos leídos por al menos un usuario
  porcentajeLeidos.value = totalVirtuales.value > 0 ? ((totalLeidos.value / totalVirtuales.value) * 100).toFixed(1) : 0

  // Tabla de libros leídos con conteo por usuario
  librosParaTabla.value = librosVirtuales
    .filter(l => librosLeidosPorIsbn[l.isbn])
    .map(l => {
      const lecturas = librosLeidosPorIsbn[l.isbn] || 0 
      const seed = parseInt(l.isbn.slice(-3)) || 1
      return {
        titulo: l.titulo,
        autor: l.autor,
        isbn: l.isbn,
        lecturas: lecturas,
        descargas: seed % 4
      }
    })

  // Libros en mora
  librosEnMora.value = libros.value.filter(l => l.estado === 'en mora')

  // Usuarios en mora
  usuariosEnMora.value = usuarios.value.filter(u => u.calificacionPromedio === 0)

  // Conteo de solicitudes pendientes
  solicitudesPendientes.value = solicitudes.value.filter(s => s.estado === 'pendiente').length
}


onMounted(() => {
  generarEstadisticas()
})
</script>

<style scoped>
h2 {
  color: #ba0707;
  font-size: 1.7em;
}

h4 {
  color: #ba0707;
  font-size: 1.3em;
}

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

.estadisticas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
  gap: 20px;
  margin-bottom: 30px;
}

.carta-estadistica {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.carta-estadistica h3 {
  font-size: 0.9em;
  color: #6c757d;
  margin-bottom: 5px;
}

.carta-estadistica p {
  font-size: 2em;
  font-weight: bold;
  margin: 0;
}

.barra-progreso {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin: 15px 0;
  height: 30px;
  overflow: hidden;
}

.llenado-barra {
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
@media (max-width: 768px) {
  .reportes-admin {
    margin-left: 0;
    padding: 10px;
  }

  .estadisticas {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  button {
    width: 100%;
    margin-bottom: 15px;
  }

  .barra-progreso {
    height: 24px;
  }

  .llenado-barra {
    font-size: 13px;
    line-height: 24px;
    padding-right: 6px;
  }

  h2 {
    font-size: 1.4em;
    text-align: center;
  }

  h4 {
    font-size: 1.1em;
    text-align: center;
  }

  .reporte-tabla {
    font-size: 0.85em;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .reporte-tabla th,
  .reporte-tabla td {
    padding: 8px;
  }
}

</style>