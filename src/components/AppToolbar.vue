<template>
  <v-toolbar app color="primary" fixed dark>
    <v-toolbar-side-icon @click.stop="toggleAppDrawer"></v-toolbar-side-icon>
    <v-toolbar-title>UPT. Puskesmas II Klungkung</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="handleFullScreen()">
      <v-icon>fullscreen</v-icon>
    </v-btn>
    <v-menu offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
      <v-btn icon large flat slot="activator">
        <v-avatar size="30px">
          <v-icon dark large>account_circle</v-icon>
        </v-avatar>
      </v-btn>
      <v-list>
        <v-list-tile v-for="(item,index) in items" @click="menuClickHandler(item)" ripple="ripple" :disabled="item.disabled" :key="index">
          <v-list-tile-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>    
</template>
<script>

import { mapActions } from 'vuex'

export default {
  name: 'app-toolbar',
  props: {
  },
  data: () => ({
    items: [
      {
        id: 0,
        icon: 'security',
        href: '#',
        title: 'Ganti Password'
      },
      {
        id: 1,
        icon: 'fullscreen_exit',
        href: '#',
        title: 'Logout'
      }
    ]
  }),
  created () {
  },
  methods: {
    ...mapActions(['toggleAppDrawer', 'logout']),
    handleFullScreen () {
      let doc = window.document
      let docEl = doc.documentElement

      let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
      let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen

      if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl)
      } else {
        cancelFullScreen.call(doc)
      }
    },
    menuClickHandler (item) {
      if (item.id === 1) {
        this.logout()
        this.$router.replace('/login')
      }
    }
  }
}
</script>
