import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入需要的组件
import Login from '@/views/Login/Login.vue'
import Main from '@/views/Main/Main.vue'
import Home from '@/views/Home/Home.vue'
import User from '@/views/User/User.vue'
import Search from '@/views/Search/Search.vue'
import SearchResult from '@/views/SearchResult/SearchResult.vue'
import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
import UserEdit from '@/views/UserEdit/UserEdit.vue'
import Chat from '@/views/Chat/Chat.vue'

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
  { path: '/search/:kw', component: SearchResult, name: 'search-result', props: true },
  // 文章详情的路由规则
  { path: '/article/:id', component: ArticleDetail, name: 'art-detail', props: true },
  // 编辑用户资料的路由规则
  { path: '/user/edit', component: UserEdit, name: 'user-edit' },
  // 小思同学的路由规则
  { path: '/chat', component: Chat, name: 'chat' }
]

const router = new VueRouter({
  routes
})

export default router
