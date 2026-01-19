<template>
    <aside class="barra">
        <div class="contenedor">
            <div class="logo">
                <h2>LibroULEAM</h2>
            </div>

            <nav>
                <router-link to="/usuario/inicio">Inicio</router-link>
                <router-link to="/usuario/catalogo">Catálogo</router-link>
                <router-link to="/usuario/libros-fisicos">Libros Físicos</router-link>
                <router-link to="/usuario/mis-lecturas">Mis Lecturas</router-link>
                <router-link to="/usuario/ayuda">Ayuda</router-link>
            </nav>

            <button class="cerrarsesion" @click="salir">
                Cerrar sesión
            </button>
        </div>
    </aside>
</template>

<script setup>
    import { useRouter } from 'vue-router'
    import { useAuth } from '@/composables/useAuth'

    const router = useRouter()
    const { cerrarSesion } = useAuth()

    function salir() {
    cerrarSesion()
    router.replace('/')
    }
</script>

<style scoped>
.barra {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px; 
  height: 100vh;
  background-color: #c60505;
  display: flex;
  justify-content: space-between;
  padding: 30px 0;
}

.contenedor {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  color: #fff;
  font-family: 'Times New Roman', Times, sans-serif;
  font-size: 20px;
  font-weight: bolder;
  text-align: center;
  margin-bottom: 40px;
}

nav {
  width: 100%;
}

nav a {
  display: block;
  width: 100%;
  padding: 15px 0;
  color: #fff;
  text-decoration: none;
  font-size: 16px; 
  font-weight: bold;
  text-align: center;
  transition: background 0.3s;
}

nav a:hover,
nav a.router-link-active {
  background-color: rgba(255,255,255,0.2);
}

.cerrarsesion {
  background: none;
  margin-top: 100px;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
@media (max-width: 1024px) {
  .barra {
    width: 200px;
  }

  .main {
    margin-left: 200px;
  }
}

</style>

