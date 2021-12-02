<template>
  <div id="page-alerts">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-widget title="">
            <div slot="widget-content"></div>
          </v-widget>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import VWidget from '@/components/VWidget'
export default {
  components: {
    VWidget
  },
  data: () => ({
  }),
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
