<template>
  <header class="header-admin">
    <div class="header-content">
      <h1>LibroULEAM</h1>
      <div class="user-info">
        <span class="nombre">{{ usuario?.nombre }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { getUsuario } = useAuth()
const usuario = ref(null)

onMounted(() => {
  usuario.value = getUsuario()
})
</script>

<style scoped>
.header-admin {
  background-color: #c60505;
  color: white;
  padding: 15px 30px;
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

h1 {
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nombre {
  font-weight: bold;
  font-size: 1em;
  text-align: right;
}
</style>
