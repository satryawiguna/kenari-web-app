import axios from './axiosbase'

export default {
  async getCurrentQueues () {
    let response = null
    try {
      response = await axios.get('/queues')
    } catch (e) {
      response = e
    }
    return response
  },
  async getQueueByUnit (unitId) {
    let response = null
    try {
      response = await axios.get('/units/' + unitId + '/queues')
    } catch (e) {
      response = e
    }
    return response
  },
  async setNextQueue (unitId) {
    let response = null
    try {
      response = await axios.get('/units/' + unitId + '/queues/next')
    } catch (e) {
      response = e
    }
    return response
  },
  async addQueue (unitId, patientId) {
    let response = null
    try {
      response = await axios.post('/units/' + unitId + '/queues', { patientId: patientId })
    } catch (e) {
      response = e
    }
    return response
  },
  async callNextQueue (unitId) {
    let response = null
    try {
      response = await axios.get('/units/' + unitId + '/queues/next')
    } catch (e) {
      response = e
    }
    return response
  },
  async recallCurrentQueue (unitId) {
    let response = null
    try {
      response = await axios.get('/units/' + unitId + '/queues/recall')
    } catch (e) {
      response = e
    }
    return response
  },
  async pickQueue (unitId, index) {
    let response = null
    try {
      response = await axios.get('/units/' + unitId + '/queues/pick/' + index)
    } catch (e) {
      response = e
    }
    return response
  }
}
