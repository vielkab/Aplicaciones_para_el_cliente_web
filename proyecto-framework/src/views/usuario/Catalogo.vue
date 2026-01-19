<template>
  <section id="catalogo">
    <h1>Catálogo de Libros</h1>

    <div v-if="libros.length === 0" class="principalvacio">
      No hay libros registrados aún
    </div>

    <div v-else>
      <div class="libro" v-for="libro in libros" :key="libro.isbn">
        <div class="imagen">
          <img :src="libro.portada" :alt="libro.titulo" />
        </div>
        <div class="infoimagen">
          <h3>{{ libro.titulo }}</h3>
          <p><strong>Autor:</strong> {{ libro.autor }}</p>
          <p><strong>Categoría:</strong> {{ libro.categoria }}</p>
          <p><strong>ISBN:</strong> {{ libro.isbn }}</p>
          <p><strong>Editorial:</strong> {{ libro.editorial }}</p>
          <p><strong>Año:</strong> {{ libro.anio }}</p>
          <p><strong>Tipo de Libro:</strong> {{ libro.tipolibro }}</p>
          <div v-if="libro.usuarioPrestamista && libro.estado === 'prestado'" class="info-prestamo-usuario">
            <p><strong>Disponible en:</strong> {{ diasRestantes(libro.fechaDevolucionEsperada) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import librosJSON from '@/assets/data/libros.json'

const libros = ref([])

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

onMounted(() => {
  cargarLibros()
})
</script>

<style scoped>
#catalogo {
  background-color: #fff; 
  margin: 20px auto;
  width: 75vw; 
  display: flex;
  flex-direction: column; 
  gap: 20px;
}

#catalogo h1 {
  text-align : left;
  color: #ba0707;
  margin-bottom: 15px;
  font-size: 1.7em;
}

.libro {
  display: flex;
  flex-direction: row;
  background: beige;
  border-radius: 10px;
  padding: 15px;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 40px;
}

.imagen img {
  width: 200px;
  height: 280px;
  object-fit: cover;
  border-radius: 4px;
}

.infoimagen {
  display: flex;
  flex-direction: column;
  gap: 5px;
  line-height: 3px;
  margin-left: 40px;
}

.principalvacio {
 

.info-prestamo-usuario {
  background: #fff3cd;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  border-left: 3px solid #ffc107;
}

.info-prestamo-usuario p {
  margin: 5px 0;
  font-size: 0.9em;
} font-size: 23px;
  font-weight: bolder;
  text-align: center;
  margin-top: 50px;
}
</style>
