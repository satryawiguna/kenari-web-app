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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
