import axios from './axiosbase'

export default {
  async getSurvey (filter, pagination) {
    let response = null
    try {
      response = await axios.get('/surveys', { params: {
        Clue: filter,
        PageNumber: pagination.page,
        PageSize: pagination.rowsPerPage
      } })
    } catch (e) {
    }
    return response
  },
  async saveSurvey (survey) {
    let response = null
    try {
      if (survey.id === 0) {
        response = await axios.post('/surveys', survey)
      } else {
        response = await axios.put('/surveys/' + survey.id, survey)
      }
    } catch (e) {
      response = e
    }
    return response
  },
  async deleteSurvey (id) {
    let response = null
    try {
      response = await axios.delete('/surveys/' + id)
    } catch (e) {
      response = e
    }
    return response
  },
  async getSurveys () {
    let response = null
    try {
      response = await axios.get('/surveys/all')
    } catch (e) {
      response = e
    }
    return response
  },
  async getSurveyDetail (id) {
    let response = null
    try {
      response = await axios.get('/surveys/' + id)
    } catch (e) {
      response = e
    }
    return response
  },
  async getActiveSurvey (id) {
    let response = null
    try {
      response = await axios.get('/surveys/active')
    } catch (e) {
      response = e
    }
    return response
  },
  async submitSurvey (id, surveyResponse) {
    let response = null
    try {
      response = await axios.post('/surveys/' + id + '/responses', surveyResponse)
    } catch (e) {
      response = e
    }
    return response
  }
}
