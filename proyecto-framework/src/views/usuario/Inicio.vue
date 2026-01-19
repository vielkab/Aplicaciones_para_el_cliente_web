<template>
  <section id="catalogo">
    <div v-if="librosVirtuales.length === 0">
      <p style="font-size:20px; font-weight: bolder;">No hay libros virtuales disponibles</p>
    </div>

    <div v-else>
      <div v-for="(categoriaLibros, categoria) in categorias" :key="categoria">
        <h2 style="text-align:left;">{{ categoria.toUpperCase() }}</h2>
        <div class="contenedor-libros">
          <div class="libro" v-for="libro in categoriaLibros" :key="libro.isbn">
            <div class="imagen">
              <img :src="libro.portada" :alt="libro.titulo">
            </div>
            <div class="infoimagen">
              <h3>{{ libro.titulo }}</h3>
              <p><strong>Autor:</strong> {{ libro.autor }}</p>
              <p><strong>Tipo de Libro:</strong> {{ libro.tipolibro }}</p>
              <p class="estado-lectura"><strong>Estado:</strong> <span>{{ obtenerEstado(libro.isbn) }}</span></p>
              <div v-if="libro.usuarioPrestamista && libro.estado === 'prestado'" class="info-prestamo-usuario">
                <p><strong>Disponible en:</strong> {{ diasRestantes(libro.fechaDevolucionEsperada) }}</p>
              </div>
            </div>
            <div class="botonlibro" v-if="libro.tipolibro === 'Virtual'">
              <button 
                @click="marcarFavorito(libro.isbn)"
                :style="{ backgroundColor: esFavorito(libro.isbn) ? '#dceeaeff' : '#ffffffff', border: 'none' }">
                ⭐
              </button>
              <button v-if="!obtenerEstado(libro.isbn) || obtenerEstado(libro.isbn) === 'NO LEÍDO'" @click="marcarLeido(libro.isbn)">Leer</button>
              <button @click="descargarLibro(libro.titulo)">Descargar</button>
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
import librosJSON from '@/assets/data/libros.json'

const { getUsuario, obtenerEstadoLibro, guardarEstadoLibro, verificarYMarcarLibrosVencidos } = useAuth()
const usuario = ref(getUsuario())

const libros = ref([])
const estadoLibrosUsuario = ref({})
const alertasVencimiento = ref([])

// Filtrar solo libros virtuales
const librosVirtuales = computed(() => {
  return libros.value.filter(libro => libro.tipolibro === 'Virtual')
})

// Función para calcular días y horas restantes
function diasRestantes(fechaDevolucionEsperada) {
  if (!fechaDevolucionEsperada) return '-'
  
  const ahora = new Date()
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

// Agrupar libros virtuales por categoría
const categorias = computed(() => {
  const grouped = {}
  librosVirtuales.value.forEach(libro => {
    if (!grouped[libro.categoria]) grouped[libro.categoria] = []
    grouped[libro.categoria].push(libro)
  })
  return grouped
})

function cargarLibros() {
  try {
    const almacenados = JSON.parse(localStorage.getItem('libros') || '[]')
    if (almacenados && almacenados.length > 0) {
      libros.value = almacenados
    } else {
      libros.value = librosJSON
      localStorage.setItem('libros', JSON.stringify(libros.value))
    }
  } catch (error) {
    libros.value = librosJSON
    localStorage.setItem('libros', JSON.stringify(libros.value))
  }
}

function cargarEstadoLibrosUsuario() {
  if (!usuario.value) return
  
  estadoLibrosUsuario.value = {}
  
  // Obtener estado de cada libro
  librosVirtuales.value.forEach(libro => {
    const estado = obtenerEstadoLibro(libro.isbn)
    estadoLibrosUsuario.value[libro.isbn] = { ...estado }
  })
}

function obtenerEstado(isbn) {
  return estadoLibrosUsuario.value[isbn]?.lectura || 'NO LEÍDO'
}

function esFavorito(isbn) {
  return estadoLibrosUsuario.value[isbn]?.favorito || false
}

function verificarLibrosVencidos() {
  const alertas = verificarYMarcarLibrosVencidos()
  if (alertas.length > 0) {
    alertasVencimiento.value = alertas
    alertas.forEach(alerta => {
      alert(alerta.mensaje)
    })
    // Recargar libros para mostrar los cambios
    cargarLibros()
  }
}

function marcarFavorito(isbn) {
  const libro = libros.value.find(l => l.isbn === isbn)
  if (!libro) return
  
  const estadoActual = estadoLibrosUsuario.value[isbn] || { favorito: false, lectura: 'NO LEÍDO' }
  const nuevoEstado = { ...estadoActual, favorito: !estadoActual.favorito }
  
  // Guardar en localStorage por usuario
  guardarEstadoLibro(isbn, nuevoEstado)
  
  // Actualizar estado local reactivo
  estadoLibrosUsuario.value[isbn] = nuevoEstado
  
  alert(`Libro ${libro.titulo} ${nuevoEstado.favorito ? 'añadido a' : 'eliminado de'} Favoritos.`)
}

function marcarLeido(isbn) {
  const libro = libros.value.find(l => l.isbn === isbn)
  if (!libro) return
  
  const estadoActual = estadoLibrosUsuario.value[isbn] || { favorito: false, lectura: 'NO LEÍDO' }
  const nuevoEstado = { ...estadoActual, lectura: 'leyendo' }
  
  // Guardar en localStorage por usuario
  guardarEstadoLibro(isbn, nuevoEstado)
  
  estadoLibrosUsuario.value[isbn] = nuevoEstado
  
  alert(`El libro ${libro.titulo} ha sido marcado como 'leyendo'.`)
}

function descargarLibro(titulo) {
  alert(`Simulando descarga del libro: ${titulo}`)
}

// Inicializar
onMounted(() => {
  usuario.value = getUsuario()
  cargarLibros()
  cargarEstadoLibrosUsuario()
  // Verificar si hay libros vencidos
  verificarLibrosVencidos()
})
</script>

<style scoped>

#catalogo {
  background-color: rgb(255, 255, 255); 
  margin: 0;
  margin-left: 0px;
  width: 75vw; 
  display: flex;
  flex-direction: column;
}

#catalogo h1 {
  margin: 0;
  padding-bottom: 20px;
}

#catalogo h2 {
  margin: 20px 20px;
  text-align: center;
  font-size: 1.5em;
  color: #ba0707;
}

.contenedor-libros {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
}

#catalogo .libro {
  background: beige;
  border-radius: 8px;
  padding: 5px;
  margin: 10px;
  text-align: center;
  width: 230px; 
  height: 390px;
}

#catalogo img {
  width: 120px;
  height: 150px;
  padding: 10px;
  margin: 0px 5px;
}

.info-prestamo-usuario {
  background: #fff3cd;
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
  border-left: 3px solid #ffc107;
}

.info-prestamo-usuario p {
  margin: 5px 0;
  font-size: 0.85em;
}
@media (max-width: 768px) {
  #catalogo {
    width: 95vw;
    margin: 0 auto;
  }
  #catalogo h2 {
    font-size: 1.3em;
    margin: 15px 0;
    text-align: center;
  }
  .contenedor-libros {
    justify-content: center;
  }
  #catalogo .libro {
    width: 170px;
    height: auto;
    padding: 10px;
    margin: 8px;
  }
  #catalogo img {
    width: 100px;
    height: 130px;
    padding: 5px;
  }
  .infoimagen h3 {
    font-size: 1em;
  }
  .infoimagen p {
    font-size: 0.85em;
  }
  .botonlibro {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 5px;
  }
  .botonlibro button {
    font-size: 0.8em;
    padding: 6px;
  }
  .info-prestamo-usuario {
    font-size: 0.8em;
    text-align: center;
  }
}
</style>

