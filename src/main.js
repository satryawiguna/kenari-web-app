// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

/* global signalR */
/* eslint no-undef: "error" */

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/es5/util/colors'
import VuetifyConfirm from 'vuetify-confirm'
import Toast from '@/components/toast'
import VueAxios from 'vue-axios'
import axiosBase from '@/api/axiosbase'
import VeeValidate from 'vee-validate'
import FingerprintSDK from '@/utils/fingerprint'
import 'material-design-icons/iconfont/material-icons.css'
import moment from 'moment'

Vue.prototype.$toast = Toast
Vue.prototype.moment = moment

Vue.use(Vuetify, { theme: {
  primary: colors.green.base
}})
Vue.use(VuetifyConfirm)
Vue.use(VueAxios, axiosBase)
Vue.use(VeeValidate)

// signal r
const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(process.env.API_URL + '/hub')
    .configureLogging(signalR.LogLevel.Information)
    .build()
hubConnection.start().catch(err => console.error(err.toString()))
Vue.prototype.$hub = hubConnection

// fingerprint
const fingerprintSDK = new FingerprintSDK()
Vue.prototype.$fingerprint = fingerprintSDK

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
