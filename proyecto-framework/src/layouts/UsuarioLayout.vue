<template>
  <div class="usuario-layout">
    <SidebarUser />
    <div class="main-content">
      <HeaderUser />
      <main class="contenido">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import SidebarUser from '@/components/usuario/SidebarUser.vue'
import HeaderUser from '@/components/usuario/HeaderUser.vue'
</script>

<style scoped>
.usuario-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
}

.contenido {
  flex: 1;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
}
</style>
