<template>
  <div class="admin-layout">
    <SidebarAdmin />
    <div class="main-content">
      <HeaderAdmin />
      <main class="contenido">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import SidebarAdmin from '@/components/admin/SidebarAdmin.vue'
import HeaderAdmin from '@/components/admin/HeaderAdmin.vue'
</script>

<style scoped>
.admin-layout {
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

