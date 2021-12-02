<template>
  <v-layout row class="align-center layout px-4 pt-4 app--page-header">
    <div class="page-header-left">
      <h3 class="pr-3 font-weight-light" style="font-size: 24px;">{{title}}</h3>
    </div>
    <v-spacer></v-spacer>
    <v-breadcrumbs divider="-" :items="breadcrumbs">
      <template slot="item" slot-scope="props">
        <template v-if="props.item.icon">
          <v-icon larg>home</v-icon>
        </template>
        <template v-else>
          <a disabled="disabled" :href="props.item.href" class="v-breadcrumbs__item v-breadcrumbs__item--disabled">{{ props.item.text }}</a>
        </template>
      </template>
    </v-breadcrumbs>
  </v-layout>  
</template>

<script>
import MenuApi from '@/api/menu'

export default {
  data () {
    return {
      title: '',
      breadcrumbs: []
    }
  },
  mounted () {
    // this.createBreadcrumbs()
  },
  methods: {
    createBreadcrumbs () {
      let breadcrumbs = []
      breadcrumbs.push({ text: 'Home', icon: 'home', disabled: true })
      let menu = MenuApi.getMenusByRole(this.$store.state.auth.user.role)

      menu.forEach(item => {
        if (item.items) {
          let child = item.items.find(i => {
            return i.name === this.$route.name
          })
          if (child) {
            breadcrumbs.push({ text: item.title, disabled: true, href: '' })
            breadcrumbs.push({ text: child.title, disabled: true, href: child.path })
            this.title = child.title
          }
        } else {
          if (item.name === this.$route.name) {
            this.title = item.title
            breadcrumbs.push({ text: item.title, disabled: true, href: item.path })
          }
        }
      })

      this.breadcrumbs = breadcrumbs
    }
  },
  watch: {
    // '$route' (to, from) {
    //   this.createBreadcrumbs()
    // }
  }
}
</script>
