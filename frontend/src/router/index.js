import { createRouter, createWebHistory } from 'vue-router'
import login from '../components/login.vue'
import registration from '../components/registration.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/registration',
    name: 'registration',
    component:registration
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
