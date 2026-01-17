<template>
  <section id="catalogo">
    <h1>Bienvenido, {{ usuario?.nombre }}</h1>

    <div v-if="libros.length === 0">
      <p style="font-size:20px; font-weight: bolder;">No hay libros registrados aún</p>
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
            </div>
            <div class="botonlibro" v-if="libro.tipolibro === 'Virtual'">
              <button 
                @click="marcarFavorito(libro.isbn)"
                :style="{ backgroundColor: libro.favorito ? '#dceeaeff' : '#ffffffff', border: 'none' }">
                ⭐
              </button>
              <button @click="marcarLeido(libro.isbn)">Leer</button>
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

// Agrupar libros por categoría
const categorias = computed(() => {
  const grouped = {}
  libros.value.forEach(libro => {
    if (!grouped[libro.categoria]) grouped[libro.categoria] = []
    grouped[libro.categoria].push(libro)
  })
  return grouped
})

// Funciones
function cargarLibros() {
  // primero revisa localStorage, si no hay, carga desde JSON
  const almacenados = JSON.parse(localStorage.getItem('libros'))
  if (almacenados && almacenados.length) {
    libros.value = almacenados
  } else {
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
  libro.lectura = 'LEYENDO'
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
  margin: auto;
  margin-left: 0px;
  width: 75vw; 
  display: flex;
  flex-direction: column;
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
  width: 150px; 
}

#catalogo img {
  width: 120px;
  height: 150px;
  padding: 10px;
  margin: 0px 5px;
}
</style>
