import { createRouter, createWebHistory } from 'vue-router'
import CodeConvertor from '../views/CodeConvertor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CodeConvertor,
    },
    {
      path: '/convert',
      name: 'convert',
      component: () => import('../views/CodeConvertor.vue'),
    },
  ],
})

export default router
