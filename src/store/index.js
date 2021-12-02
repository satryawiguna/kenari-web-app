import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

// TYPES
const TOGGLE_APP_DRAWER = 'TOGGLE_APP_DRAWER'

// STATE
const state = {
  showAppDrawer: true
}

// MUTATIONS
const mutations = {
  [TOGGLE_APP_DRAWER] (state, toggle) {
    state.showAppDrawer = toggle
  }
}

// GETTERS
const getters = {
  showAppDrawer (state) {
    return state.showAppDrawer
  }
}

const actions = ({
  toggleAppDrawer ({ commit }) {
    commit(TOGGLE_APP_DRAWER, !state.showAppDrawer)
  },
  setAppDrawerState ({ commit }, toggle) {
    commit(TOGGLE_APP_DRAWER, toggle)
  }
})

export default new Vuex.Store({
  modules: {
    auth
  },
  state,
  mutations,
  getters,
  actions,
  strict: debug
})
