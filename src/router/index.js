import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'

// 导入需要的组件
// 导入 Login 组件
// import Login from '@/views/Login/Login.vue'
const Login = () => import('@/views/Login/Login.vue')

// 导入 Main 组件
// import Main from '@/views/Main/Main.vue'
const Main = () => import('@/views/Main/Main.vue')

// 导入 Home 组件
// import Home from '@/views/Home/Home.vue'
const Home = () => import('@/views/Home/Home.vue')

// 导入 User 组件
// import User from '@/views/User/User.vue'
const User = () => import('@/views/User/User.vue')

// 导入 Search 组件
// import Search from '@/views/Search/Search.vue'
const Search = () => import('@/views/Search/Search.vue')

// 导入 SearchResult 组件
// import SearchResult from '@/views/SearchResult/SearchResult.vue'
const SearchResult = () => import('@/views/SearchResult/SearchResult.vue')

// 导入 ArticleDetail 组件
// import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
const ArticleDetail = () => import('@/views/ArticleDetail/ArticleDetail.vue')

// 导入 UserEdit 组件
// import UserEdit from '@/views/UserEdit/UserEdit.vue'
const UserEdit = () => import('@/views/UserEdit/UserEdit.vue')

// 导入 Chat 组件
// import Chat from '@/views/Chat/Chat.vue'
const Chat = () => import('@/views/Chat/Chat.vue')

Vue.use(VueRouter)

const routes = [
  // 登录的路由规则
  { path: '/login', component: Login, name: 'login' },
  // 主页的路由规则
  {
    path: '/',
    component: Main,
    children: [
      { path: '', component: Home, name: 'home', meta: { isRecord: true, top: 0 } },
      { path: '/user', component: User }
    ]
  },
  // 搜索组件的路由规则
  { path: '/search', component: Search, name: 'search' },
  // 搜索结果组件的路由规则
  { path: '/search/:kw', component: SearchResult, name: 'search-result', props: true, meta: { isRecord: true, top: 0 } },
  // 文章详情的路由规则
  { path: '/article/:id', component: ArticleDetail, name: 'art-detail', props: true, meta: { isRecord: true, top: 0 } },
  // 编辑用户资料的路由规则
  { path: '/user/edit', component: UserEdit, name: 'user-edit' },
  // 小思同学的路由规则
  { path: '/chat', component: Chat, name: 'chat' }
]

const router = new VueRouter({
  routes
})

// 所有有权限页面路径
const pagePathArr = ['/user', '/user/edit']

// 为路由实例对象挂载全局前置守卫
router.beforeEach((to, from, next) => {
  if (pagePathArr.indexOf(to.path) !== -1) {
    // 不等于 -1 证明访问的是有权限的页面
    // 需要判断用户是否登录
    // 从 store 中获取 token 的值
    const tokenStr = store.state.userAbout.tokenInfo.token
    if (tokenStr) {
      // tokenstr 有值，说明已经登录
      next()
    } else {
      // token 不存在，说明没有登录，强制跳转到登录页，并携带上次访问失败的路由地址的参数
      next(`/login?pre=${to.fullPath}`)
    }
  } else {
    // 访问的是没有权限的页面
    next()
  }
})

// 全局后置守卫
router.afterEach((to, from) => {
  // 如果当前页面的路由元信息中，isRecord 值为 true
  if (to.meta.isRecord) {
    setTimeout(() => {
      window.scrollTo(0, to.meta.top)
    }, 0)
  }
})

// vue-router路由版本更新产生的问题,导致路由跳转失败抛出该错误
// 将 VueRouter 本身提供的 $router.push 方法转存到常量中
const originalPush = VueRouter.prototype.push
// 自定义 $router.push 方法，在内部调用原生的 originalPush 方法进行路由跳转，并通过 .catch 捕获错误
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  // 通过 .catch 捕获错误
  return originalPush.call(this, location).catch(err => err)
}

export default router
