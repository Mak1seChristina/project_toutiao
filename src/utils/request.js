// 网络请求模块
import axios from 'axios'
// Vant Toast 轻提示组件
import { Toast } from 'vant'
// 导入用户相关的 store 模块
import userStore from '@/store/userAbout.js'

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
  error => {
    return Promise.reject(error)
  }
)

export default request
