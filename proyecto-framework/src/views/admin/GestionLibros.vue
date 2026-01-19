<template>
  <section class="gestion-libros">
    <h2>Gestión de Libros</h2>
    <form
      v-if="mostrarFormulario"
      class="formulario"
      @submit.prevent="modoEdicion ? actualizarLibro() : agregarLibro()"
    >
      <label>Título:</label>
      <input v-model="form.titulo" required />

      <label>Autor:</label>
      <input v-model="form.autor" required />

      <label>ISBN:</label>
      <input v-model="form.isbn" :disabled="modoEdicion" required />

      <label>Editorial:</label>
      <input v-model="form.editorial" required />

      <label>Año de publicación:</label>
      <input type="date" v-model="form.anio" required />

      <label>Categoría:</label>
      <select v-model="form.categoria" required>
        <option value="" disabled>Seleccione</option>
        <option>Ciencia</option>
        <option>Medicina</option>
        <option>Historia</option>
        <option>Filosofía</option>
        <option>Literatura</option>
      </select>

      <label>URL de portada:</label>
      <input v-model="form.portada" required />

      <label>Tipo de libro:</label>
      <select v-model="form.tipolibro" required>
        <option value="" disabled>Seleccione</option>
        <option value="Fisico">Físico</option>
        <option value="Virtual">Virtual</option>
      </select>

      <div class="form-botones">
        <button type="submit" class="guardar">
          {{ modoEdicion ? 'Guardar cambios' : 'Subir libro' }}
        </button>

        <button type="button" class="cancelar" @click="cerrarFormulario">
          Cancelar
        </button>
      </div>
    </form>
    <section id="catalogo" v-else>
      <div class="libro" v-for="(libro, index) in libros" :key="libro.isbn">
        <img :src="libro.portada" />
        <h3>{{ libro.titulo }}</h3>

        <p><b>Autor:</b> {{ libro.autor }}</p>
        <p><b>Categoría:</b> {{ libro.categoria }}</p>
        <p><b>ISBN:</b> {{ libro.isbn }}</p>
        <p><b>Editorial:</b> {{ libro.editorial }}</p>
        <p><b>Año:</b> {{ libro.anio }}</p>
        <p><b>Tipo Libro:</b> {{ libro.tipolibro }}</p>

        <div class="acciones">
          <button class="editar" @click="editarLibro(index)">Editar</button>
          <button class="eliminar" @click="confirmarEliminar(index)">
            Eliminar
          </button>
        </div>
      </div>
    </section>

    <!-- boton gregar libro -->
    <button
      v-if="!mostrarFormulario"
      class="btn-flotante"
      @click="abrirFormulario"
    >
      +
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

/* estados */
const libros = ref([])
const mostrarFormulario = ref(false)
const modoEdicion = ref(false)
const indiceEditar = ref(null)

/* formulario */
const form = ref({
  titulo: '',
  autor: '',
  isbn: '',
  editorial: '',
  anio: '',
  categoria: '',
  portada: '',
  tipolibro: ''
})

/* cargar localstorage */
onMounted(() => {
  libros.value = JSON.parse(localStorage.getItem('libros')) || []
})

/* formulario */
function abrirFormulario() {
  mostrarFormulario.value = true
  modoEdicion.value = false
  limpiarFormulario()
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  modoEdicion.value = false
  indiceEditar.value = null
  limpiarFormulario()
}

function editarLibro(index) {
  indiceEditar.value = index
  modoEdicion.value = true
  mostrarFormulario.value = true

  form.value = { ...libros.value[index] }
}

function validarISBN(isbn) {
  if (!/^\d{13}$/.test(isbn)) {
    alert('El ISBN debe ser numérico y tener exactamente 13 caracteres')
    return false
  }

  const repetido = libros.value.some(libro => libro.isbn === isbn)
  if (repetido) {
    alert('El ISBN ya existe en el catálogo')
    return false
  }

  return true
}


function validarFecha(fecha) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const ayer = new Date(hoy)
  ayer.setDate(hoy.getDate() - 1)

  const fechaLibro = new Date(fecha)

  if (fechaLibro > ayer) {
    alert('La fecha debe ser como máximo hasta ayer')
    return false
  }

  return true
}

function agregarLibro() {
  if (!validarISBN(form.value.isbn)) return
  if (!validarFecha(form.value.anio)) return

  const nuevoLibro = {
    ...form.value,
    id: Date.now(),
    estado: 'disponible',
    favorito: false,
    lectura: form.value.tipolibro === 'Virtual' ? 'NO LEÍDO' : ''
  }
  libros.value.push(nuevoLibro)
  guardar()
  cerrarFormulario()
}

function actualizarLibro() {
  if (!validarFecha(form.value.anio)) return

  libros.value[indiceEditar.value] = { ...form.value }
  guardar()
  cerrarFormulario()
}

function confirmarEliminar(index) {
  const libro = libros.value[index]
  
  // Validar que no se eliminen libros físicos prestados
  if (libro.tipolibro === 'Fisico' && libro.estado === 'prestado') {
    alert('No puedes eliminar un libro físico que está prestado. Primero debe ser devuelto.')
    return
  }
  
  if (confirm('¿Estás seguro de eliminar este libro?')) {
    libros.value.splice(index, 1)
    guardar()
  }
}

function guardar() {
  localStorage.setItem('libros', JSON.stringify(libros.value))
}

function limpiarFormulario() {
  form.value = {
    titulo: '',
    autor: '',
    isbn: '',
    editorial: '',
    anio: '',
    categoria: '',
    portada: '',
    tipolibro: ''
  }
}
</script>

<style scoped>
h2 {
  color: #ba0707;
  font-size: 1.7em;
}

.gestion-libros {
  padding: 20px;
}


#catalogo {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
}

.libro {
  width: 230px;
  min-height: 560px;
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  background: #f4f3ef;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  text-align: center;
}

.libro p {
  margin: 2px 0;  
  line-height: 2;    
  font-size: 15px;
}

.libro img {
  display: block;
  margin: 0 auto;
  width: 200px;
  height: 220px;
  object-fit: cover;
}

.acciones {
  margin-top: auto;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.acciones button {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.editar {
  background-color: #72716f;
  color: white;
}

.eliminar {
  background-color: #72716f;
  color: white;
}

.formulario {
  max-width: 450px;
  display: flex;
  flex-direction: column;
}

.formulario label {
  margin-top: 10px;
  font-weight: bold;
  font-size: 14px;
}

.formulario input,
.formulario select {
  border: none;
  border-bottom: 1px solid #aaa;
  padding: 6px 4px;
  font-size: 14px;
  outline: none;
}

.formulario input:focus,
.formulario select:focus {
  border-bottom: 2px solid #c60505;
}


.form-botones {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.guardar {
  background-color: #c60505;
  color: white;
  border: none;
  padding: 8px 14px;
  font-weight: bold;
}

.cancelar {
  background-color: #777;
  color: white;
  border: none;
  padding: 8px 14px;
  font-weight: bold;
}

.btn-flotante {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  font-size: 30px;
  background-color: #c60505;
  color: white;
  border-radius: 50%;
  border: none;
  cursor: pointer;
}
</style>
