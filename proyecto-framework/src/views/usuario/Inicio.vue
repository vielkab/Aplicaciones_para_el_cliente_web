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
              <p class="estado-lectura"><strong>Estado:</strong> <span>{{ libro.lectura || 'NO LEÍDO' }}</span></p>
              <div v-if="libro.usuarioPrestamista && libro.estado === 'prestado'" class="info-prestamo-usuario">
                <p><strong>Disponible en:</strong> {{ diasRestantes(libro.fechaDevolucionEsperada) }}</p>
              </div>
            </div>
            <div class="botonlibro" v-if="libro.tipolibro === 'Virtual'">
              <button 
                @click="marcarFavorito(libro.isbn)"
                :style="{ backgroundColor: libro.favorito ? '#dceeaeff' : '#ffffffff', border: 'none' }">
                ⭐
              </button>
              <button v-if="!libro.lectura || libro.lectura === 'NO LEÍDO'" @click="marcarLeido(libro.isbn)">Leer</button>
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

const { getUsuario } = useAuth()
const usuario = ref(getUsuario())

// Estado reactivo de los libros
const libros = ref([])

// Filtrar solo libros virtuales
const librosVirtuales = computed(() => {
  return libros.value.filter(libro => libro.tipolibro === 'Virtual')
})

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

// Agrupar libros virtuales por categoría
const categorias = computed(() => {
  const grouped = {}
  librosVirtuales.value.forEach(libro => {
    if (!grouped[libro.categoria]) grouped[libro.categoria] = []
    grouped[libro.categoria].push(libro)
  })
  return grouped
})

// Funciones
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

function guardarLibros() {
  localStorage.setItem('libros', JSON.stringify(libros.value))
}

function marcarFavorito(isbn) {
  const libro = libros.value.find(l => l.isbn === isbn)
  if (!libro) return
  libro.favorito = !libro.favorito
  guardarLibros()
  alert(`Libro ${libro.titulo} ${libro.favorito ? 'añadido a' : 'eliminado de'} Favoritos.`)
}

function marcarLeido(isbn) {
  const libro = libros.value.find(l => l.isbn === isbn)
  if (!libro) return
  libro.lectura = 'leyendo'
  guardarLibros()
  alert(`El libro ${libro.titulo} ha sido marcado como 'leyendo'.`)
}

function descargarLibro(titulo) {
  alert(`Simulando descarga del libro: ${titulo}`)
}

// Inicializar
onMounted(() => {
  cargarLibros()
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
</style>
