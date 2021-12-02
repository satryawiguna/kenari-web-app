import axios from './axiosbase'

export default {
  async login (username, password) {
    let response = {}
    try {
      response = await axios.post('/token', { username: username, password: password })
    } catch (e) {
      response = e
    }
    return response
  },
  async getUser (filter, pagination) {
    let response = null
    try {
      response = await axios.get('/users', { params: {
        Clue: filter,
        PageNumber: pagination.page,
        PageSize: pagination.rowsPerPage
      } })
    } catch (e) {
    }
    return response
  },
  async saveUser (user) {
    let response = null
    try {
      if (user.id === 0) {
        response = await axios.post('/users', user)
      } else {
        response = await axios.put('/users/' + user.id, user)
      }
    } catch (e) {
      response = e
    }
    return response
  },
  async deleteUser (id) {
    let response = null
    try {
      response = await axios.delete('/users/' + id)
    } catch (e) {
      response = e
    }
    return response
  },
  async getRoles () {
    let response = null
    try {
      response = await axios.get('/users/roles')
    } catch (e) {
    }
    return response
  }
}
