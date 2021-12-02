<template>
  <v-app id="login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <form @submit.prevent="login">
                <v-card-text>
                  <div class="layout column align-center">
                    <img src="/static/logo-big.png" alt="Puskesmas logo" width="109" height="120">
                    <h1 class="flex primary--text">KENARI SYSTEM</h1>
                    <h2 class="flex my-3 primary--text">UPT. Puskesmas II Klungkung</h2>
                  </div>                
                    <v-alert
                      :value="loginError"
                      type="error"
                      dismissible
                      @click="loginError = false"
                    >
                      Gagal login. Username atau password salah.
                    </v-alert>
                    <v-text-field append-icon="person" name="login" label="Username" type="text" v-model="model.username" v-validate="'required'" :error-messages="errors.collect('username')" data-vv-name="username"></v-text-field>
                    <v-text-field append-icon="lock" name="password" label="Password" id="password" type="password" v-model="model.password" v-validate="'required'" :error-messages="errors.collect('password')" data-vv-name="password"></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn type="submit" block color="primary" :loading="loading">Login</v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import UserApi from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    loading: false,
    loginError: false,
    model: {
      username: '',
      password: ''
    }
  }),
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  created () {
    if (this.isAuthenticated) {
      this.$router.replace(this.$route.query.redirect || '/dashboard')
    }
  },
  methods: {
    async login () {
      let valid = await this.$validator.validateAll()
      if (valid) {
        this.loading = true
        let response = await UserApi.login(this.model.username, this.model.password)
        this.loading = false

        if (response.success) {
          await this.$store.dispatch('login', response.data)
          this.$router.replace(this.$route.query.redirect || '/dashboard')
        } else {
          this.loginError = true
        }
      }
    }
  }
}
</script>
<style scoped lang="css">
  #login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>
