<template>
  <main class="lecturas-main">
    <section class="panel-filtro">
      <label for="filtro-categoria">Filtrar por categoría:</label>
      <select id="filtro-categoria" v-model="categoriaSeleccionada">
        <option value="todas">Todas</option>
        <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <button @click="mostrarMisLecturas">Refrescar</button>
    </section>

    <section class="contenedorsecciones">
      <!-- Leyendo -->
      <div class="col">
        <h2>Leyendo</h2>
        <div class="tarjetas lista-libros">
          <div v-if="librosLeyendo.length === 0">
            Actualmente no tienes libros marcados como "Leyendo".
          </div>
          <div v-for="libro in librosLeyendo" :key="libro.isbn" class="libro-tarjeta">
            <div class="portada-contenedor">
              <img :src="libro.portada" :alt="`Portada de ${libro.titulo}`" class="portada-miniatura" />
            </div>
            <div class="info-tarjeta">
              <h4>{{ libro.titulo }}</h4>
              <p><b>Autor:</b> {{ libro.autor }}</p>
              <p><b>Categoría:</b> {{ libro.categoria }}</p>
              <p class="estado-lectura"><b>Estado:</b> {{ obtenerEstado(libro.isbn) }}</p>
              <div class="acciones-lectura">
                <button v-if="obtenerEstado(libro.isbn) !== 'leido'" @click="marcarComoLeido(libro.isbn)" class="btn-accion">Marcar Leído</button>
                <button v-if="!obtenerEstado(libro.isbn) || obtenerEstado(libro.isbn) === 'no-leido'" @click="iniciarLectura(libro.isbn)" class="btn-accion">Iniciar Lectura</button>
                <button @click="marcarFavorito(libro.isbn)" class="btn-accion">
                  {{ esFavorito(libro.isbn) ? 'Favorito' : 'Marcar Favorito' }}
                </button>
                <button @click="descargarLibro(libro.isbn)" class="btn-descarga">Descargar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Leídos -->
      <div class="col">
        <h2>Leídos</h2>
        <div class="tarjetas lista-libros">
          <div v-if="librosLeidos.length === 0">
            Aún no has marcado libros como "Leídos".
          </div>
          <div v-for="libro in librosLeidos" :key="libro.isbn" class="libro-tarjeta">
            <div class="portada-contenedor">
              <img :src="libro.portada" :alt="`Portada de ${libro.titulo}`" class="portada-miniatura" />
            </div>
            <div class="info-tarjeta">
              <h4>{{ libro.titulo }}</h4>
              <p><b>Autor:</b> {{ libro.autor }}</p>
              <p><b>Categoría:</b> {{ libro.categoria }}</p>
              <p class="estado-lectura"><b>Estado:</b> {{ obtenerEstado(libro.isbn) }}</p>
              <div class="acciones-lectura">
                <button v-if="obtenerEstado(libro.isbn) !== 'leido'" @click="marcarComoLeido(libro.isbn)" class="btn-accion">Marcar Leído</button>
                <button v-if="!obtenerEstado(libro.isbn) || obtenerEstado(libro.isbn) === 'no-leido'" @click="iniciarLectura(libro.isbn)" class="btn-accion">Iniciar Lectura</button>
                <button @click="marcarFavorito(libro.isbn)" class="btn-accion">
                  {{ esFavorito(libro.isbn) ? 'Favorito' : 'Marcar Favorito' }}
                </button>
                <button @click="descargarLibro(libro.isbn)" class="btn-descarga">Descargar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Favoritos -->
      <div class="col">
        <h2>Favoritos</h2>
        <div class="tarjetas lista-libros">
          <div v-if="librosFavoritos.length === 0">
            Aún no tienes libros marcados como "Favoritos".
          </div>
          <div v-for="libro in librosFavoritos" :key="libro.isbn" class="libro-tarjeta">
            <div class="portada-contenedor">
              <img :src="libro.portada" :alt="`Portada de ${libro.titulo}`" class="portada-miniatura" />
            </div>
            <div class="info-tarjeta">
              <h4>{{ libro.titulo }}</h4>
              <p><b>Autor:</b> {{ libro.autor }}</p>
              <p><b>Categoría:</b> {{ libro.categoria }}</p>
              <p class="estado-lectura"><b>Estado:</b> {{ obtenerEstado(libro.isbn) }}</p>
              <div class="acciones-lectura">
                <button v-if="obtenerEstado(libro.isbn) !== 'leido'" @click="marcarComoLeido(libro.isbn)" class="btn-accion">Marcar Leído</button>
                <button v-if="!obtenerEstado(libro.isbn) || obtenerEstado(libro.isbn) === 'no-leido'" @click="iniciarLectura(libro.isbn)" class="btn-accion">Iniciar Lectura</button>
                <button @click="marcarFavorito(libro.isbn)" class="btn-accion">
                  {{ esFavorito(libro.isbn) ? 'Favorito' : 'Marcar Favorito' }}
                </button>
                <button @click="descargarLibro(libro.isbn)" class="btn-descarga">Descargar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import librosJSON from '@/assets/data/libros.json'

const { getUsuario, obtenerEstadoLibro, guardarEstadoLibro } = useAuth()
const usuario = ref(getUsuario())

const libros = ref([])
const categoriaSeleccionada = ref('todas')
const categorias = ref([])
const estadoLibrosUsuario = ref({})

function cargarLibros() {
  const almacenados = JSON.parse(localStorage.getItem('libros'))
  if (almacenados && almacenados.length) {
    libros.value = almacenados
  } else {
    libros.value = librosJSON
    localStorage.setItem('libros', JSON.stringify(libros.value))
  }
  generarCategorias()
  cargarEstadoLibrosUsuario()
}

function generarCategorias() {
  const cats = new Set(libros.value.filter(l => l.tipolibro === 'Virtual').map(l => l.categoria))
  categorias.value = Array.from(cats)
}

function cargarEstadoLibrosUsuario() {
  // Cargar el estado de los libros para el usuario actual
  if (!usuario.value) return
  
  estadoLibrosUsuario.value = {}
  
  // Obtener estado de cada libro
  libros.value.forEach(libro => {
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

// Computed para filtrar libros
const librosFiltrados = computed(() => 
  libros.value.filter(l => categoriaSeleccionada.value === 'todas' || l.categoria === categoriaSeleccionada.value)
               .filter(l => l.tipolibro === 'Virtual')
)

const librosLeyendo = computed(() => librosFiltrados.value.filter(l => obtenerEstado(l.isbn) === 'leyendo'))
const librosLeidos = computed(() => librosFiltrados.value.filter(l => obtenerEstado(l.isbn) === 'leido'))
const librosFavoritos = computed(() => librosFiltrados.value.filter(l => esFavorito(l.isbn)))

function iniciarLectura(isbn) {
  const libro = libros.value.find(l => l.isbn === isbn)
  if (!libro) return
  
  const estadoActual = estadoLibrosUsuario.value[isbn] || { favorito: false, lectura: 'NO LEÍDO' }
  const nuevoEstado = { ...estadoActual, lectura: 'leyendo' }
  
  // Guardar en localStorage por usuario
  guardarEstadoLibro(isbn, nuevoEstado)
  
  // Actualizar estado local reactivo
  estadoLibrosUsuario.value[isbn] = nuevoEstado
  
  alert(`Iniciaste la lectura de: ${libro.titulo}`)
}

function marcarComoLeido(isbn) {
  const libro = libros.value.find(l => l.isbn === isbn)
  if (!libro) return
  
  const estadoActual = estadoLibrosUsuario.value[isbn] || { favorito: false, lectura: 'NO LEÍDO' }
  const nuevoEstado = { ...estadoActual, lectura: 'leido' }
  
  // Guardar en localStorage por usuario
  guardarEstadoLibro(isbn, nuevoEstado)
  
  // Actualizar estado local reactivo
  estadoLibrosUsuario.value[isbn] = nuevoEstado
  
  alert(`¡Felicidades! Terminaste de leer el libro: ${libro.titulo}.`)
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

function descargarLibro(isbn) {
  const libro = libros.value.find(l => l.isbn === isbn)
  if (!libro) return
  alert(`Simulando descarga del libro: ${libro.titulo}`)
}

function mostrarMisLecturas() {
  cargarLibros()
}

onMounted(() => {
  usuario.value = getUsuario()
  cargarLibros()
})
</script>

<style scoped>

h2 {
    color: #b90202;
    font-weight: bolder;
    font-size: 25px;
}

.lecturas-main { 
  padding: 20px; 
  box-sizing: border-box; 
}

.col {
  padding-bottom: 15px;
}

.lista-libros {
  background-color: rgb(255, 255, 255); 
  padding: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
}

.libro-tarjeta {
  background-color: #e5e4e4; 
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  width: 250px;
  justify-content: space-between;
  height: auto;
}

.portada-contenedor {
  width: 100%;
  height: 150px;
  overflow: hidden;
  margin-bottom: 10px;
  border-radius: 4px;
}

.portada-miniatura {
  width: 100%;
  height: 100%;
  object-fit: cover; 
}

.acciones-lectura {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
}

.btn-accion, .btn-descarga {
  padding: 8px;
  border: 1px solid #8f0606;
  background-color: #b50505;
  color: rgb(239, 228, 228);
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-descarga {
  background-color: #056d1f;
  border: none;
}

.btn-accion:hover {
  background-color: #a20404;
}

.btn-descarga:hover {
  background-color: #035e19;
}
.panel-filtro {
  display: flex;
  align-items: center; 
  gap: 10px; 
  margin-bottom: 20px; 
}

.panel-filtro select {
  padding: 3px 5px;
  border-radius: 4px;
  border: 1px solid #8f0606;
  font-size: 14px;
}

.panel-filtro button {
  padding: 5px 12px;
  border-radius: 4px;
  border: none;
  background-color: #b50505;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.panel-filtro button:hover {
  background-color: #a20404;
}
</style>
