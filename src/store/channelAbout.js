export default {
  namespaced: true,
  state: {
    // 频道列表是否处于要被删除的状态
    isDel: false
  },
  actions: {},
  mutations: {
    resetIsDel(state, value) {
      state.isDel = value
    }
  }
}
