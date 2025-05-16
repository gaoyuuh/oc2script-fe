import { createRouter, createWebHistory } from 'vue-router'
import Convertor from '../views/Convertor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Convertor,
    },
    {
      path: '/convert',
      name: 'convert',
      component: () => import('../views/Convertor.vue'),
    },
  ],
})

export default router
