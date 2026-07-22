import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior (to) {
    // navegación con ancla (#menu, #ubicacion…) → scroll suave a la sección
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 90 }
    }
    return { top: 0 }
  }
})

export default router
