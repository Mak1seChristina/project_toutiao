import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入需要的组件
import Login from '@/views/Login/Login.vue'
import Main from '@/views/Main/Main.vue'
import Home from '@/views/Home/Home.vue'
import User from '@/views/User/User.vue'
import Search from '@/views/Search/Search.vue'
import SearchResult from '@/views/SearchResult/SearchResult.vue'

Vue.use(VueRouter)

const routes = [
  // 登录的路由规则
  { path: '/login', component: Login, name: 'login' },
  // 主页的路由规则
  {
    path: '/',
    component: Main,
    children: [
      { path: '', component: Home },
      { path: '/user', component: User }
    ]
  },
  // 搜索组件的路由规则
  { path: '/search', component: Search, name: 'search' },
  // 搜索结果组件的路由规则
  { path: '/search/:kw', component: SearchResult, name: 'search-result', props: true }
]

const router = new VueRouter({
  routes
})

export default router
