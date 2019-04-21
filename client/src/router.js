import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Movie from '@/views/Movie.vue'
import Register from '@/views/Registration.vue'
import Profile from '@/views/Profile.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Movie
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: Profile
    }
  ]
})
