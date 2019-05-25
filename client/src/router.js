import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/LoginPage.vue'
import Movie from '@/pages/MoviePage.vue'
import Register from '@/pages/RegistrationPage.vue'
import Profile from '@/pages/ProfilePage.vue'

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
