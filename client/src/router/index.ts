import { createRouter, createWebHistory } from 'vue-router'
import UserList from '../views/UserList.vue'
import UserNew from '../views/UserNew.vue'
import TimelineView from '../views/TimelineView.vue'
import AuthLayout from '../components/auth/AuthLayout.vue'
import { authService } from '../services/authService'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TimelineView,
      meta: { requiresAuth: true }
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthLayout,
      meta: { guest: true }
    },
    {
      path: '/users',
      name: 'users',
      component: UserList,
      meta: { requiresAuth: true }
    },
    {
      path: '/users/new',
      name: 'users-new',
      component: UserNew,
      meta: { requiresAuth: true }
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const currentUser = authService.getCurrentUser()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestRoute = to.matched.some(record => record.meta.guest)

  if (requiresAuth && !currentUser) {
    next('/auth')
  } else if (isGuestRoute && currentUser) {
    next('/')
  } else {
    next()
  }
})

export default router
