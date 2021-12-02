import jwtDecode from 'jwt-decode'
import axios from '@/api/axiosbase'
// TYPES
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'

const state = {
  user: null,
  isAuthenticated: false
}

const mutations = {

  [LOGIN] (state, user) {
    state.isAuthenticated = true
    state.user = user
    localStorage.setItem('appToken', user.token)
    axios.defaults.headers['Authorization'] = 'Bearer ' + localStorage.getItem('appToken')
  },
  [LOGOUT] (state) {
    state.isAuthenticated = false
    state.user = null
    localStorage.removeItem('appToken')
  }
}

const getters = {
  currentUser (state) {
    return state.user
  },
  isAuthenticated (state) {
    return state.isAuthenticated
  }
}

const actions = {
  login ({ commit }, user) {
    commit(LOGIN, user)
  },
  logout ({ commit }) {
    commit(LOGOUT)
  },
  checkUserAuthentication ({ commit }) {
    let appToken = localStorage.getItem('appToken')

    if (appToken == null || appToken === '') {
      commit(LOGOUT)
    } else {
      try {
        let decodeToken = jwtDecode(appToken)
        commit(LOGIN, { id: decodeToken.sub, username: decodeToken.unique_name, name: decodeToken.given_name, role: decodeToken.role, token: appToken })
      } catch (e) {
        console.log('invalid token')
        commit(LOGOUT)
      }
    }
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
