<template>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-toolbar color="primary darken-1" dark>
        <img src="/static/logo.png" height="36" alt="Sistem Kenari">
        <v-toolbar-title>
          <span>Sistem Kenari</span>
        </v-toolbar-title>        
      </v-toolbar>
      <v-list>
        <template v-for="item in drawerMenu">
          <v-subheader v-if="item.header" :key="item.header">
            {{ item.header }}
          </v-subheader>
          <v-list-group v-else-if="item.items"
            :key="item.title"
            :prepend-icon="item.icon"
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile
              v-for="subItem in item.items"
              :key="subItem.name"
              :to="subItem.path"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>{{ subItem.action }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :to="item.path" :key="item.name" :target="item.target">
              <v-list-tile-action v-if="item.icon">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
import MenuApi from '@/api/menu'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'app-drawer',
  components: {
  },
  props: {
  },
  data: () => ({
    clipped: false,
    fixed: false,
    miniVariant: false
  }),
  computed: {
    ...mapState(['showAppDrawer']),
    ...mapGetters(['currentUser']),
    drawer: {
      set (toggle) {
        this.setAppDrawerState(toggle)
      },
      get () {
        return this.showAppDrawer
      }
    },
    drawerMenu () {
      if (this.currentUser) {
        return MenuApi.getMenusByRole(this.currentUser.role)
      } else {
        return []
      }
    }
  },
  created () {
  },
  methods: {
    ...mapActions(['setAppDrawerState'])
  }
}
</script>
<style>
  .v-navigation-drawer>.v-list .v-list__tile {
    font-weight: 400;
  }
</style>

