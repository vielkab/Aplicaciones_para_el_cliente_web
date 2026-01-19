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
  height: 100vh;
  overflow: hidden;
}

.contenido {
  flex: 1;
  padding: 10px 20px;
  box-sizing: border-box;
  background-color: #fff;
  overflow-y: auto;
}
@media (max-width: 768px){
.usuario-layout{flex-direction:column}
.main-content{margin-left:0;height:auto}
.contenido{padding:10px;height:auto}
}
</style>
