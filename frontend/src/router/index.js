import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store'
import login from '../components/userLogin.vue'
import registration from '../components/userRegistration.vue'
import userDashboard from '../components/clientSide/userDashboard.vue'
import chatRooms from '../components/clientSide/chatRoom.vue'

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
  },
  {
    path:'/user/dashboard',
    name:'userDashboard',
    component: userDashboard,
    meta: { requiresAuth: true }, 
  },
  {
    path:'/user/chatRooms/:room_id',
    name:'chatRooms',
    component: chatRooms,
    meta: { requiresAuth: true }, 
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to the login page or handle unauthorized access
    next('/');
  } else {
    next();
  }
});

export default router
