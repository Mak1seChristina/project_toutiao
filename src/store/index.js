import Vue from 'vue'
import Vuex from 'vuex'

import userAbout from '@/store/userAbout.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    userAbout
  }
})
