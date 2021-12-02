<template>
  <div class="appRoot">
    <template v-if="!$route.meta.public">
      <v-app>
        <app-drawer></app-drawer>
        <app-toolbar></app-toolbar>
        <v-content>
          <page-header></page-header>
          <router-view/>
          <v-footer class="pa-3" app>
            <v-spacer></v-spacer>
            <div>&copy; {{ new Date().getFullYear() }}. Made with <span style="color: #e25555;">&#9829;</span> by CMT</div>
          </v-footer>
        </v-content>
      </v-app>
    </template>
    <template v-else>
      <transition>
        <keep-alive>
      <v-app>
        <v-content>
          <router-view></router-view>
        </v-content>
      </v-app>
        </keep-alive>
      </transition>
    </template>
  </div>
 </template>
<script>
import AppDrawer from '@/components/AppDrawer'
import AppToolbar from '@/components/AppToolbar'
import PageHeader from '@/components/PageHeader'
import { mapActions } from 'vuex'
export default {
  components: {
    AppDrawer,
    AppToolbar,
    PageHeader
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions(['toggleAppDrawer']),
    toggleDrawer () {
      this.toggleAppDrawer()
    }
  },
  name: 'App'
}
</script>
