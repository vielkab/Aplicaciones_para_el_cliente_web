<template>
  <section class="portada">
    <img src="https://media.traveler.es/photos/65030135fa748d8eb93dcd7c/16:9/w_2560%2Cc_limit/_F.-Jousseaume-3-@Yuka-Toyoshima.jpg" alt="">
  </section>
  <section class="registro">
    <div class="logo">
            <img src="https://www.uleam.edu.ec/wp-content/uploads/2012/09/LOGO-ULEAM-VERTICAL.png" alt="">
            <h1>REGISTRO <br> LibroULEAM</h1>
    </div>
    <form @submit.prevent="validarFormulario">
      <div class="ingreso">

        <div class="input">
          <label>CORREO</label>
          <input type="email"  v-model="correo">
        </div>

        <div class="input">
          <label>CONTRASEÑA</label>
          <input type="password"  v-model="password">
        </div>

        <div class="boton">
          <button type="submit">INICIAR SESIÓN</button>
        </div>

        <a href="#" @click.prevent="recuperarContrasena">¿Olvidó su contraseña?</a>
        
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </form>

  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const { login } = useAuth()
const router = useRouter()

const correo = ref('')
const password = ref('')
const error = ref('')

function validarFormulario() {
  error.value = ''

  if (!correo.value || !password.value) {
    error.value = 'Completa todos los campos'
    return
  }

  const usuario = login(correo.value, password.value)

  if (!usuario) {
    error.value = 'Usuario o contraseña incorrectos'
    return
  }

  // 🔹 PASAMOS EL USUARIO DIRECTAMENTE EN EL PUSH
  if (usuario.rol === 'administrador') {
    router.push({ path: '/admin/inicio', state: { usuario } })
  } else {
    router.push({ path: '/usuario/inicio', state: { usuario } })
  }
}
</script>


<style scoped>

</style>