<template>
  <div class="modal-overlay" @click.self="cerrar">
    <div class="modal-contenedor">
      <h3>Calificar a {{ nombreUsuario }}</h3>
      
      <div class="calificacion-info">
        <p><b>Calificación actual:</b> {{ calificacionActual.toFixed(1) }} / 5.0</p>
        <p><b>Total de préstamos:</b> {{ totalPrestamos }}</p>
      </div>

      <div class="estrellas-container">
        <span
          v-for="n in 5"
          :key="n"
          class="estrella"
          :class="{ activa: n <= valorSeleccionado, hover: hoverValor && n <= hoverValor }"
          @click="seleccionar(n)"
          @mouseover="hoverValor = n"
          @mouseleave="hoverValor = 0"
        >★</span>
      </div>

      <div class="preview-calificacion" v-if="hoverValor > 0">
        {{ hoverValor }} estrella{{ hoverValor !== 1 ? 's' : '' }}
      </div>

      <div class="botones">
        <button @click="confirmar" class="btn-confirmar" v-if="valorSeleccionado > 0">
          Confirmar ({{ valorSeleccionado }} ★)
        </button>
        <button @click="cerrar" class="btn-cancelar">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  nombreUsuario: {
    type: String,
    required: true
  },
  calificacionActual: {
    type: Number,
    default: 0
  },
  totalPrestamos: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['calificar', 'cerrar'])

const valorSeleccionado = ref(0)
const hoverValor = ref(0)

function seleccionar(n) {
  valorSeleccionado.value = n
}

function confirmar() {
  emit('calificar', valorSeleccionado.value)
  cerrar()
}

function cerrar() {
  valorSeleccionado.value = 0
  hoverValor.value = 0
  emit('cerrar')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-contenedor {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 90%;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

h3 {
  margin: 0 0 20px 0;
  color: #333;
  text-align: center;
  font-size: 1.3em;
}

.calificacion-info {
  text-align: center;
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  color: #666;
  font-size: 0.95em;
}

.calificacion-info p {
  margin: 8px 0;
}

.estrellas-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 30px 0;
}

.estrella {
  font-size: 3em;
  color: #ddd;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}
.estrella:hover,
.estrella.hover {
  transform: scale(1.2);
  color: #ffc107;
}
.estrella.activa {
  color: #ffc107;
}
.preview-calificacion {
  text-align: center;
  color: #666;
  font-size: 0.95em;
  margin-bottom: 20px;
  min-height: 20px;
}
.botones {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.btn-confirmar,
.btn-cancelar {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}
.btn-confirmar {
  background: #4caf50;
  color: white;
}
.btn-confirmar:hover {
  background: #45a049;
  transform: translateY(-2px);
}
.btn-cancelar {
  background: #f0f0f0;
  color: #333;
}
.btn-cancelar:hover {
  background: #e0e0e0;
}
@media (max-width:600px){
.modal-contenedor{padding:20px;width:95%}
h3{font-size:1.1em}
.calificacion-info{font-size:0.85em;padding:10px}
.estrellas-container{gap:10px}
.estrella{font-size:2.5em}
.botones{flex-direction:column;gap:8px}
.btn-confirmar,.btn-cancelar{padding:8px 15px;font-size:0.9em}
}
</style>
