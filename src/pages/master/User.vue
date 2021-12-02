<template>
    <div id="survey-content">
        <v-container grid-list-xl fluid>
            <v-layout row wrap="">
                <v-flex xs12>
                    <v-card>
                        <v-card-title>
                            <v-dialog v-model="dialog" persistent scrollable max-width="700px">
                                <v-btn slot="activator" color="primary" dark @click.native="openFormUser">
                                    <v-icon dark>add</v-icon>
                                    User Baru
                                </v-btn>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">{{ formTitle }}</span>
                                        <v-spacer></v-spacer>
                                        <v-btn icon @click.native="closeFormUser">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container grid-list-md>
                                            <v-layout wrap="">
                                                <v-flex xs12 sm12 md12>
                                                    <v-text-field label="Nama Pengguna"
                                                                  v-model="editedUser.username"
                                                                  v-validate="'required'" :error-messages="errors.collect('username')" data-vv-name="username" data-vv-as="Nama Pengguna"></v-text-field>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-text-field label="Kata Sandi"
                                                                  v-model="editedUser.password"
                                                                  v-validate="'required'" :error-messages="errors.collect('password')" data-vv-name="password" data-vv-as="Kata Sandi"
                                                                  v-if="editedIndex === -1"></v-text-field>
                                                    <v-text-field label="Kata Sandi"
                                                                  v-model="editedUser.password"
                                                                  v-if="editedIndex !== -1"></v-text-field>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-select
                                                            :items="roleRows"
                                                            item-text="name"
                                                            item-value="id"
                                                            label="Role"
                                                            v-model="editedUser.roleId"
                                                            v-validate="'required'"
                                                            :error-messages="errors.collect('roleId')"
                                                            data-vv-name="roleId"
                                                            data-vv-as="Role"
                                                    ></v-select>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-text-field label="Nama"
                                                                  v-model="editedUser.name"></v-text-field>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-text-field label="Email"
                                                                  v-model="editedUser.email"
                                                                  v-validate="'required|email'" :error-messages="errors.collect('email')" data-vv-name="email" data-vv-as="Email"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn @click.native="closeFormUser" flat>Tutup</v-btn>
                                        <v-btn color="primary darken-1" flat @click.native="saveUser">Simpan</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <v-spacer></v-spacer>
                            <v-text-field
                                    v-model="search"
                                    append-icon="search"
                                    label="Search"
                                    single-line
                                    hide-details>
                            </v-text-field>
                        </v-card-title>
                        <v-data-table
                                :headers="headers"
                                :items="rows"
                                :pagination.sync="pagination"
                                :total-items="totalRows"
                                :loading="loading"
                                select-all
                                v-model="selected"
                                item-key="id">
                            <template slot="items" slot-scope="props">
                                <td>
                                    <v-checkbox v-model="props.selected" primary hide-details
                                                color="primary"></v-checkbox>
                                </td>
                                <td class="">{{ props.item.name }}</td>
                                <td class="">{{ props.item.email }}</td>
                                <td class="">{{ props.item.roleName }}</td>
                                <td class="is-locked">
                                    <v-chip v-if="props.item.isLocked === true" color="primary">Enable</v-chip>
                                    <v-chip v-if="props.item.isLocked === false" color="red">Disable</v-chip>
                                </td>
                                <td class="is-active">
                                    <v-chip v-if="props.item.isActive === true" color="primary">Enable</v-chip>
                                    <v-chip v-if="props.item.isActive === false" color="red">Disable</v-chip>
                                </td>
                                <td class="">
                                    <v-btn small flat icon color="orange" @click="editUser(props.item)">
                                        <v-icon>create</v-icon>
                                    </v-btn>
                                    <v-btn small flat icon color="red" @click="deleteUser(props.item)">
                                        <v-icon>delete</v-icon>
                                    </v-btn>
                                </td>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-flex>
                <v-flex lg12></v-flex>
            </v-layout>
        </v-container>
    </div>
</template>
<script>
    import VWidget from '@/components/VWidget'
    import UserApi from '@/api/user'

    export default {
      components: {
        VWidget
      },
      data: () => ({
        editedIndex: -1,
        defaultUser: {
          id: 0,
          name: '',
          email: '',
          roleId: '',
          username: '',
          password: ''
        },
        editedUser: {
          id: 0,
          name: '',
          email: '',
          roleId: '',
          username: '',
          password: ''
        },
        search: '',
        totalRows: 0,
        rows: [],
        roleRows: [],
        loading: true,
        pagination: {},
        selected: [],
        headers: [
                { text: 'Nama', align: 'left', value: 'name' },
                { text: 'Email', value: 'email' },
                { text: 'Role', value: 'roleName' },
                { text: 'Terkunci', value: 'isLocked' },
                { text: 'Aktif', value: 'isActive' },
                { text: '', value: 'action' }
        ],
        dialog: false,
        pickerMenu: false
      }),
      watch: {
        pagination: {
          handler () {
            this.getUser()
          },
          deep: true
        }
      },
      mounted () {
        this.getUser()
      },
      computed: {
        formTitle () {
          return this.editedIndex === -1 ? 'User Baru' : 'Edit User'
        }
      },
      methods: {
        async getUser () {
          this.loading = true
          let response = await UserApi.getUser(this.search, this.pagination)
          this.rows = response.data
          this.totalRows = response.pagination.TotalRecords
          this.loading = false
        },
        async saveUser () {
          let valid = await this.$validator.validateAll()
          if (valid) {
            let response = await UserApi.saveUser(this.editedUser)
            if (response.success) {
              this.getUser()
              this.closeFormUser()
            } else {
              this.$toast.open({ text: 'Terdapat kesalahan saat menyimpan data pasien! Harap coba kembali.', type: 'error' })
            }
          }
        },
        async deleteUser (item) {
          let res = await this.$confirm('Apakah yakin akan menghapus data?', {title: 'Warning'})
          if (res) {
            let response = await UserApi.deleteUser(item.id)
            if (response.success) {
              this.getUser()
            } else {
              this.$toast.open({ text: 'Terdapat kesalahan saat menghapus data pasien! Harap coba kembali.', type: 'error' })
            }
          }
        },
        async openFormUser () {
          let response = await UserApi.getRoles()
          this.roleRows = response.data
        },
        async editUser (item) {
          let response = await UserApi.getRoles()
          this.roleRows = response.data

          this.editedIndex = this.rows.indexOf(item)
          this.editedUser = Object.assign({}, item)
          this.dialog = true
        },
        closeFormUser () {
          this.dialog = false
          this.editedUser = Object.assign({}, this.defaultUser)
          this.editedIndex = -1
        }
      }
    }
</script>

<style scoped>
.is-locked span,
.is-active span {
  color: #ffffff;
}
</style>
