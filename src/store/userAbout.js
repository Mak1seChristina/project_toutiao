import { getUserInfoAPI, getUserProfileAPI } from '@/api/userAPI.js'

// 初始的 token 信息对象
let initState = {
  // token 信息对象
  tokenInfo: {},
  // 用户的基本信息
  userInfo: {},
  // 简介信息
  userProfile: {}
}

const stateStr = localStorage.getItem('state')

if (stateStr) {
  // stateStr存在表示本地存储中有之前的 state
  initState = JSON.parse(stateStr)
}

// 用户相关的 store 实例
export default {
  namespaced: true,
  state: initState,
  actions: {
    // 初始化用户基本信息
    async initUserInfo(context) {
      const { data: res } = await getUserInfoAPI()
      if (res.message === 'OK') {
        context.commit('updateUserInfo', res.data)
      }
    },
    // 初始化简介信息
    async initUserProfile(context) {
      const { data: res } = await getUserProfileAPI()
      if (res.message === 'OK') {
        context.commit('updateUserProfile', res.data)
      }
    }
  },
  mutations: {
    // 更新 tokenInfo 的方法
    updateTokenInfo(state, value) {
      // 把提交过来的 value 对象，作为 tokenInfo 的值
      state.tokenInfo = value

      // 测试 state 中是否有数据
      console.log(state)
      this.commit('userAbout/saveStateToStorage')
    },
    // 更新 userInfo
    updateUserInfo(state, value) {
      // 把用户信息存到 state 中
      state.userInfo = value
      // 存到本地存储
      this.commit('userAbout/saveStateToStorage')
    },
    // 更新 userProfile
    updateUserProfile(state, value) {
      state.userProfile = value
      this.commit('userAbout/saveStateToStorage')
    },
    // 将 state 放入本地存储
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    },
    // 清空 state
    cleanState(state) {
      state.tokenInfo = {}
      state.userInfo = {}
      state.userProfile = {}

      // 将清空后的 state 保存到本地存储
      this.commit('userAbout/saveStateToStorage')
    }
  }
}
