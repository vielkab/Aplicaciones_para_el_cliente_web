<template>
  <header class="header-usuario">
    <div class="header-content">
      <p>Bienvenido</p>
      <div class="user-info">
        <div class="user-details">
          <span class="nombre">{{ usuario?.nombre }}</span>
          <span class="calificacion">⭐ {{ usuario?.calificacionPromedio?.toFixed(1) || '0.0' }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { getUsuarioActualizado } = useAuth()
const usuario = ref(null)
let intervalo = null

function actualizarUsuario() {
  usuario.value = getUsuarioActualizado()
}

onMounted(() => {
  actualizarUsuario()
  // Refresca cada 1 segundo para reflejar cambios de calificación
  intervalo = setInterval(actualizarUsuario, 1000)
})

onUnmounted(() => {
  if (intervalo) clearInterval(intervalo)
})
</script>

<style scoped>
.header-usuario {
  background-color: #ffffff;
  color: #ba0707;;
  margin-top: 0px;
  padding: 10px 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

p {
  margin: 0;
  font-size: 1.7em;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.nombre {
  font-weight: bold;
  font-size: 1.5em;
}

.calificacion {
  font-size: 0.95em;
  color: #ffc107;
  font-weight: bold;
}

.prestamos {
  font-size: 0.85em;
  color: #e0e0e0;
}
</style>
