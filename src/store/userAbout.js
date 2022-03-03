// 初始的 token 信息对象
let initState = {}

const stateStr = localStorage.getItem('state')

if (stateStr) {
  // stateStr存在表示本地存储中有之前的 state
  initState = JSON.parse(stateStr)
}

// 用户相关的 store 实例
export default {
  namespaced: true,
  state: {
    // 用来存储 token 信息的对象，将来这个对象中会包含两个属性 { token, refresh_token }
    tokenInfo: initState
  },
  actions: {},
  mutations: {
    // 更新 tokenInfo 的方法
    updateTokenInfo(state, value) {
      // 把提交过来的 value 对象，作为 tokenInfo 的值
      state.tokenInfo = value

      // 测试 state 中是否有数据
      console.log(state)
      this.commit('userAbout/saveStateToStorage')
    },
    // 将 state 放入本地存储
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    }
  }
}
