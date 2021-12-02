import axios from './axiosbase'

export default {
  async getPatients (filter, pagination) {
    let response = null
    try {
      response = await axios.get('/patients', { params: {
        Clue: filter,
        PageNumber: pagination.page,
        PageSize: pagination.rowsPerPage
      } })
    } catch (e) {
      response = e
    }
    return response
  },
  async getPatient (id) {
    let response = null
    try {
      response = await axios.get('/patients/' + id)
    } catch (e) {
      response = e
    }
    return response
  },
  async savePatient (patient) {
    let response = null
    try {
      if (patient.id === 0) {
        response = await axios.post('/patients', patient)
      } else {
        response = await axios.put('/patients/' + patient.id, patient)
      }
    } catch (e) {
      response = e
    }
    return response
  },
  async deletePatient (id) {
    let response = null
    try {
      response = await axios.delete('/patients/' + id)
    } catch (e) {
      response = e
    }
    return response
  },
  async saveFingerprintData (patientId, fingerprint) {
    let response = null
    try {
      response = await axios.post('/patients/' + patientId + '/fingerprints', { patientId: patientId, data: fingerprint.data, fingerCode: fingerprint.fingerCode })
    } catch (e) {
      response = e
    }
    return response
  },
  async deleteFingerprintData (patientId, fingerprintId) {
    let response = null
    try {
      response = await axios.delete('/patients/' + patientId + '/fingerprints/' + fingerprintId)
    } catch (e) {
      response = e
    }
    return response
  },
  async generateFMD (fingerprintImages) {
    let response = null
    try {
      response = await axios.post('/patients/fingerprints/fmd', fingerprintImages)
    } catch (e) {
      response = e
    }
    return response
  },
  async identifyPatient (patientId, fingerData) {
    let response = null
    try {
      response = await axios.post('/patients/fingerprints/identify', { patientId: patientId, fingerData: fingerData })
    } catch (e) {
      response = e
    }
    return response
  }
}
