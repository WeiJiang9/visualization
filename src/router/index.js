import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'screenpage',
    component: () => import('@/views/ScreenPage')
  }
  // {
  //   path: '/sellpage',
  //   name: 'sellpage',
  //   component: () => import('@/views/SellerPage')
  // },
  // {
  //   path: '/trendpage',
  //   name: 'trendpage',
  //   component: () => import('@/views/TrendPage')
  // },
  // {
  //   path: '/mappage',
  //   name: 'mappage',
  //   component: () => import('@/views/MapPage')
  // },
  // {
  //   path: '/rankpage',
  //   name: 'rankpage',
  //   component: () => import('@/views/RankPage')
  // },
  // {
  //   path: '/hotpage',
  //   name: 'hotpage',
  //   component: () => import('@/views/HotPage')
  // },
  // {
  //   path: '/stockpage',
  //   name: 'stockpage',
  //   component: () => import('@/views/StockPage')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
