// 网络请求模块
import axios from 'axios'
// Vant Toast 轻提示组件
import { Toast } from 'vant'
// 导入用户相关的 store 模块
import userStore from '@/store/userAbout.js'

import store from '@/store'

import router from '@/router'

import { exchangeTokenAPI } from '@/api/userAPI.js'

const request = axios.create({
  // 请求根路径
  baseURL: 'http://www.liulongbin.top:8000'
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 展示 loading 效果
    Toast.loading({
      message: '加载中...',
      duration: 0 // 值为 0 表示提示不会消失
    })
    // 1. 获取 token 值
    const tokenStr = userStore.state.tokenInfo.token
    // 2. 如果 tokenStr 不为空，则请求头中添加 token 字段
    if (tokenStr) {
      config.headers.Authorization = `Bearer ${tokenStr}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 隐藏 loading 效果
    Toast.clear()
    return response
  },
  async error => {
    // 在请求失败的时候，关闭 loading 提示
    Toast.clear()

    /* // 如果有响应并且状态码是401，则说明 token 已经过期了
    if (error.response && error.response.status === 401) {
      // 清空 vuex 和 localStorage
      store.commit('userAbout/cleanState')
      // 强制跳转到登录页，并通过路由的 query 查询参数，把当前用户访问未遂的路由地址带给登录页
      router.replace('/login?pre=' + router.currentRoute.fullPath)
    } */

    // 1. 从 vuex 中获取 tokenInfo 对象，格式为 { token, tokenInfo }
    const tokenInfo = store.state.userAbout.tokenInfo

    // 2. 判断 token 是否过期
    if (error.response && error.response.status === 401 && tokenInfo.refresh_token) {
      // token 过期
      try {
        // 发起请求，根据 refresh_token 重新请求一个 token
        const { data: res } = await exchangeTokenAPI(tokenInfo.refresh_token)

        // 更新 store 中的 token
        store.commit('userAbout/updateTokenInfo', { token: res.data.token, refresh_token: tokenInfo.refresh_token })

        // 重新请求刚才的请求
        // 如果在响应拦截器中 return 一个新的 Promise 异步请求，则会把这次请求的结果，当作上次请求的返回值
        return request(error.config)
      } catch {
        // token 和 refresh_token 都失效了

        // 清空 vuex 和 localStorage
        store.commit('userAbout/cleanState')
        // 强制跳转到登录页
        router.replace('/login?pre=' + router.currentRoute.fullPath)
      }
    }

    return Promise.reject(error)
  }
)

export default request
