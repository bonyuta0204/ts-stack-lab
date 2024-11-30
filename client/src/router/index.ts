import { createRouter, createWebHistory } from 'vue-router'
import UserList from '../views/UserList.vue'
import UserNew from '../views/UserNew.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/users',
    },
    {
      path: '/users',
      name: 'users',
      component: UserList,
    },
    {
      path: '/users/new',
      name: 'users-new',
      component: UserNew,
    },
  ],
})

export default router
