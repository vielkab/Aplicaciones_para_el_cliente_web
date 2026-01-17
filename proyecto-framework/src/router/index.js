import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Login from '@/views/Login.vue'

// Admin
import AdminLayout from '@/layouts/AdminLayout.vue'
import InicioAdmin from '@/views/admin/Inicio.vue'
import LibrosFisicosAdmin from '@/views/admin/LibrosFisicos.vue'
import GestionLibros from '@/views/admin/GestionLibros.vue'
import Reportes from '@/views/admin/Reportes.vue'
import AyudaAdmin from '@/views/admin/Ayuda.vue'

// Usuario
import UsuarioLayout from '@/layouts/UsuarioLayout.vue'
import InicioUsuario from '@/views/usuario/Inicio.vue'
import LibrosFisicosUsuario from '@/views/usuario/LibrosFisicos.vue'
import Catalogo from '@/views/usuario/Catalogo.vue'
import MisLecturas from '@/views/usuario/MisLecturas.vue'
import AyudaUsuario from '@/views/usuario/Ayuda.vue'

const routes = [
  { path: '/', component: Login },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiereAuth: true, rol: 'administrador' },
    redirect: '/admin/inicio',
    children: [
      { path: 'inicio', component: InicioAdmin },
      { path: 'gestion-libros', component: GestionLibros },
      { path: 'libros-fisicos', component: LibrosFisicosAdmin },
      { path: 'reportes', component: Reportes },
      { path: 'ayuda', component: AyudaAdmin }
    ]
  },

  {
    path: '/usuario',
    component: UsuarioLayout,
    meta: { requiereAuth: true },
    redirect: '/usuario/inicio',
    children: [
      { path: 'inicio', component: InicioUsuario },
      { path: 'catalogo', component: Catalogo },
      { path: 'libros-fisicos', component: LibrosFisicosUsuario },
      { path: 'mis-lecturas', component: MisLecturas },
      { path: 'ayuda', component: AyudaUsuario }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 🔹 Primero revisamos si hay usuario en el router state (después localStorage)
  const usuario =
    history.state?.usuario || JSON.parse(localStorage.getItem('usuarioActivo'))

  if (to.meta.requiereAuth && !usuario) {
    next('/') // No logueado
    return
  }

  if (to.path.startsWith('/admin') && usuario?.rol !== 'administrador') {
    next('/') // No admin
    return
  }

  if (to.path.startsWith('/usuario') && usuario?.rol === 'administrador') {
    next('/admin/inicio') // Admin no puede ir a usuario
    return
  }

  if (to.path.startsWith('/usuario') && !usuario?.rol) {
    next('/') // Usuario sin rol definido
    return
  }

  next()
})

export default router
