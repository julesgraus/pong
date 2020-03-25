import Vue from 'vue'
import VueRouter from 'vue-router'
import Game from '@/views/Game.vue'
import Menu from '@/views/Menu.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'menu',
    component: Menu
  },
  {
    path: '/single_player',
    name: 'game',
    component: Game
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
