<template>
  <div class="contenedor-login">
    <section class="portada">
      <img
        src=https://media.traveler.es/photos/65030135fa748d8eb93dcd7c/16:9/w_2560%2Cc_limit/_F.-Jousseaume-3-@Yuka-Toyoshima.jpg
        alt=""
      />
    </section>

    <section class="registro">
      <div class="logo">
        <img
          src="https://www.uleam.edu.ec/wp-content/uploads/2012/09/LOGO-ULEAM-VERTICAL.png"
          alt=""
        />
        <h1>REGISTRO <br /> LibroULEAM</h1>
      </div>

      <form @submit.prevent="validarFormulario">
        <div class="ingreso">
          <div class="input">
            <label>CORREO</label>
            <input type="email" v-model="correo" />
          </div>
          <div class="input">
            <label>CONTRASEÑA</label>

            <div class="contrasena">
              <input
                :type="mostrarPassword ? 'text' : 'password'"
                v-model="password"
              />

              <span class="ojo" @click="togglePassword">
                <!-- ojo cerrado -->
                <svg
                  v-if="!mostrarPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 5C7 5 2.7 8.1 1 12c1.7 3.9 6 7 11 7s9.3-3.1 11-7c-1.7-3.9-6-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
                  />
                </svg>

                <!-- ojo abierto -->
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M2 5.3 3.3 4l16.7 16.7-1.3 1.3-3.1-3.1A11.4 11.4 0 0 1 12 19c-5 0-9.3-3.1-11-7a11.8 11.8 0 0 1 4.4-5.4L2 5.3z"
                  />
                </svg>
              </span>
            </div>
          </div>
          <p v-if="error" class="error">{{ error }}</p>
          <div class="boton">
            <button type="submit">INICIAR SESIÓN</button>
          </div>

          <a href="#" @click.prevent="recuperarContrasena">
            ¿Olvidó su contraseña?
          </a>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { login } = useAuth()
const router = useRouter()
const correo = ref('')
const password = ref('')
const mostrarPassword = ref(false)
const error = ref('')
function togglePassword() {
  mostrarPassword.value = !mostrarPassword.value
}

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

  if (usuario.rol === 'administrador') {
    router.push({ path: '/admin/inicio', state: { usuario } })
  } else {
    router.push({ path: '/usuario/inicio', state: { usuario } })
  }
}

function recuperarContrasena() {
  window.open(
    'https://forms.office.com/Pages/ResponsePage.aspx?id=AHmhMYl1_EyxGvToPCe47WtWxVg3SZxDjNSPwLXvKDZUMkI5VjFCWEtCWVU0RkRBMkVTQlZKQVpNRCQlQCN0PWcu',
    '_blank'
  )
}
</script>

<style scoped>
.contenedor-login {
  width: 99vw;
  height: 97vh;
  display: flex;
  overflow: hidden;
}

.portada {
  width: 70%;
  height: 100%;
}

.portada img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.registro {
  width: 30%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


.logo {
  text-align: center;
  margin-bottom: 20px;
}

.logo img {
  width: 170px;
}

.logo h1 {
  font-size: 27px;
  margin-top: 10px;
}


.ingreso {
  width: 100%;
  max-width: 400px;
}


.input {
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
}

.input label {
  font-size: 13px;
  color: #671a1a;
}

.input input {
  border: none;
  border-bottom: 2px solid #b61b1b;
  padding: 5px 30px 5px 0;
  outline: none;
  background: transparent;
}


.contrasena {
  position: relative;
}

.ojo {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.ojo svg {
  width: 18px;
  height: 18px;
  fill: #333;
}


.boton {
  text-align: center;
}

.boton button {
  width: 80%;
  padding: 10px;
  background: rgb(206, 5, 5);
  border: none;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
}

.boton button:hover {
  background: #be0505;
}


a {
  display: block;
  text-align: right;
  margin-top: 40px;
  font-size: 15px;
  color: #050af9;
  text-decoration: none;
}

.error {
  color: rgb(185, 5, 5);
  text-align: center;
  margin-bottom: 25px;
}
</style>
