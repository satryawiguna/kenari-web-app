import axios from './axiosbase'

export default {
  async getRoom (filter, pagination) {
    let response = null
    try {
      response = await axios.get('/units', { params: {
        Clue: filter,
        PageNumber: pagination.page,
        PageSize: pagination.rowsPerPage
      } })
    } catch (e) {
    }
    return response
  },
  async getAllRoom () {
    let response = await this.getRoom('', { page: 1, rowsPerPage: 10000 })
    return response
  },
  async saveRoom (room) {
    let response = null
    try {
      if (room.id === 0) {
        response = await axios.post('/units', room)
      } else {
        response = await axios.put('/units/' + room.id, room)
      }
    } catch (e) {
      response = e
    }
    return response
  },
  async deleteRoom (id) {
    let response = null
    try {
      response = await axios.delete('/units/' + id)
    } catch (e) {
      response = e
    }
    return response
  }
}
