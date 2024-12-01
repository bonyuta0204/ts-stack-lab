import { createRouter, createWebHistory } from 'vue-router'
import UserList from '../views/UserList.vue'
import UserNew from '../views/UserNew.vue'
import TimelineView from '../views/TimelineView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TimelineView,
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
