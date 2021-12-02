import Vue from 'vue'
import Router from 'vue-router'
import paths from './paths.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from './../store'

Vue.use(Router)
const router = new Router({
  base: '/',
  mode: 'history',
  linkActiveClass: 'active',
  routes: paths
})
// router gards
router.beforeEach((to, from, next) => {
  NProgress.start()

  if (store.getters.currentUser == null) {
    store.dispatch('checkUserAuthentication')
  }

  if (!to.meta.public) {
    if (!store.getters.isAuthenticated) {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    } else {
      if (to.meta.role) {
        if (to.meta.role.includes(store.getters.currentUser.role)) {
          next()
        } else {
          next(false)
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  // ...
  NProgress.done()
})

export default router
