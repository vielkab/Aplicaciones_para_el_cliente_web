<template>
  <section id="catalogo">
    <p v-if="libros.length === 0" class="principalvacio">
      No hay libros registrados aún
    </p>
    <div v-for="libro in libros" :key="libro.isbn" class="libro">
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
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import librosJSON from '@/assets/data/libros.json'

const libros = ref([])

onMounted(() => {
  //Intentar cargar desde localStorage
  const guardados = localStorage.getItem('libros')

  if (guardados) {
    libros.value = JSON.parse(guardados)
  } else {
    //Si no hay, usar JSON inicial
    libros.value = librosJSON
    localStorage.setItem('libros', JSON.stringify(librosJSON))
  }
})
</script>

<style scoped>
#catalogo {
  background-color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.libro {
  background: beige;
  border-radius: 8px;
  padding: 10px;
  margin: 10px 0;
  display: flex;
  position: relative;
}

.imagen img {
  width: 190px;
  height: 250px;
  padding: 15px;
}

.infoimagen {
  margin-left: 20px;
}

.botonlibro {
  position: absolute;
  right: 30px;
  bottom: 30px;
  display: flex;
  gap: 10px;
}

.botonlibro button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: rgb(175, 9, 9);
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.botonlibro button:hover {
  background-color: rgb(159, 6, 6);
}

.principalvacio {
  font-size: 23px;
  font-weight: bolder;
  margin-top: 40px;
}
@media (max-width: 768px) {
  #catalogo {
    padding: 10px;
  }

  .libro {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .imagen img {
    width: 150px;
    height: 200px;
    padding: 10px;
  }

  .infoimagen {
    margin-left: 0;
  }

  .principalvacio {
    font-size: 18px;
    text-align: center;
  }
}

</style>
