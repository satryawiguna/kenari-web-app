import axios from 'axios'
import router from '@/router'
import store from '@/store'

const API_URL = (process.env.API_URL + '/api') || ''
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + (localStorage['appToken'] || '')
  }
})

instance.interceptors.response.use(
   function (response) {
     let successResponse = { success: true, data: response.data }

     if (response.headers['x-pagination']) {
       successResponse['pagination'] = JSON.parse(response.headers['x-pagination'])
     }
     return successResponse
   },
   function (error) {
     if (error.response.status === 401) {
       store.dispatch('logout')

       if (router.currentRoute.path !== '/login') {
         router.push('/login?redirect=' + this.$route.path)
       }
     } else {
       var errorResponse = { success: false, exceptions: error.response.data }
       return Promise.reject(errorResponse)
     }
   }
)

export default instance
