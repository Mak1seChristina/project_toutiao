// 网络请求模块
import axios from 'axios'

const request = axios.create({
  // 请求根路径
  baseURL: 'http://www.liulongbin.top:8000'
})

export default request
