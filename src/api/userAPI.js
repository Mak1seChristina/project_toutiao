// 导入 axios 实例对象
import request from '@/utils/request.js'

// 导入 axios
import axios from 'axios'

export const loginAPI = data => {
  return request.post('/v1_0/authorizations', data)
}

// 请求用户基本信息
export const getUserInfoAPI = () => {
  return request.get('/v1_0/user')
}

// 请求用户的简介信息
export const getUserProfileAPI = () => {
  return request.get('/v1_0/user/profile')
}

// 修改用户简介信息
// 形参中的 obj 是对象
// obj = {name: xxx, birthday: xxx}
export const updateUserProfileAPI = obj => {
  return request.patch('/v1_0/user/profile', obj)
}

// 修改头像
export const updateUserAvatarAPI = photoFD => {
  return request.patch('/v1_0/user/photo', photoFD)
}

// 换取新的 token
export const exchangeTokenAPI = refreshToken => {
  return axios({
    method: 'PUT',
    url: 'http://www.liulongbin.top:8000/v1_0/authorizations',
    headers: {
      // 请求头中携带身份认证字段
      Authorization: 'Bearer' + refreshToken
    }
  })
}
