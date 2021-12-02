<template>
  <div id="ruangan-content">
    <v-container grid-list-xl fluid>
      <v-layout row wrap="">
        <v-flex xs12>
          <v-card>
            <v-card-title>
              <v-dialog v-model="dialog" persistent scrollable max-width="700px">
                <v-btn slot="activator" color="primary" dark>
                  <v-icon dark>add</v-icon>Ruangan Baru
                </v-btn>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click.native="closeFormRoom">
                      <v-icon>close</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap="">
                        <v-flex xs12 sm12 md12>
                          <v-text-field label="Nama" v-model="editedRoom.name" 
                          v-validate="'required'" :error-messages="errors.collect('name')" data-vv-name="name" data-vv-as="Nama"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field label="Deskripsi" v-model="editedRoom.description"></v-text-field>
                        </v-flex>
                        <v-flex xs4>
                          <v-text-field label="Prefix Kode Antrian" v-model="editedRoom.queuePrefixCode" v-validate="'required'" :error-messages="errors.collect('queuePrefixCode')" data-vv-name="queuePrefixCode" data-vv-as="Prefix Kode Antrian"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click.native="closeFormRoom" flat>Tutup</v-btn>
                    <v-btn color="primary darken-1" flat @click.native="saveRoom">Simpan</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
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
                  <v-checkbox v-model="props.selected" primary hide-details color="primary"></v-checkbox>
                </td>
                <td class="">{{ props.item.name }}</td>
                <td class="">{{ props.item.description }}</td>
                <td class="">{{ props.item.queuePrefixCode }}</td>
                <td class="">
                  <v-btn small flat icon color="orange" @click="editRoom(props.item)">
                    <v-icon>create</v-icon>
                  </v-btn>
                  <v-btn small flat icon color="red" @click="deleteRoom(props.item)">
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
import RoomApi from '@/api/room'

export default {
  components: {
    VWidget
  },
  data: () => ({
    editedIndex: -1,
    defaultRoom: {
      id: 0,
      name: '',
      description: '',
      queuePrefixCode: ''
    },
    editedRoom: {
      id: 0,
      name: '',
      description: '',
      queuePrefixCode: ''
    },
    search: '',
    totalRows: 0,
    rows: [],
    loading: true,
    pagination: {},
    selected: [],
    headers: [
      { text: 'Nama', align: 'left', value: 'name' },
      { text: 'Deskripsi', value: 'description' },
      { text: 'Prefix Kode Antrian', value: 'queuePrefixCode' },
      { text: '', value: 'action' }
    ],
    dialog: false,
    pickerMenu: false
  }),
  watch: {
    pagination: {
      handler () {
        this.getRoom()
      },
      deep: true
    }
  },
  mounted () {
    this.getRoom()
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Ruangan Baru' : 'Edit Ruangan'
    }
  },
  methods: {
    async getRoom () {
      this.loading = true
      let response = await RoomApi.getRoom(this.search, this.pagination)
      this.rows = response.data
      this.totalRows = response.pagination.TotalRecords
      this.loading = false
    },
    async deleteRoom (item) {
      let res = await this.$confirm('Apakah yakin akan menghapus data?', {title: 'Warning'})
      if (res) {
        let response = await RoomApi.deleteRoom(item.id)
        if (response.success) {
          this.getRoom()
        } else {
          this.$toast.open({ text: 'Terdapat kesalahan saat menghapus data pasien! Harap coba kembali.', type: 'error' })
        }
      }
    },
    async saveRoom () {
      let valid = await this.$validator.validateAll()
      if (valid) {
        let response = await RoomApi.saveRoom(this.editedRoom)
        if (response.success) {
          this.getRoom()
          this.closeFormRoom()
        } else {
          this.$toast.open({ text: 'Terdapat kesalahan saat menyimpan data pasien! Harap coba kembali.', type: 'error' })
        }
      }
    },
    editRoom (item) {
      this.editedIndex = this.rows.indexOf(item)
      this.editedRoom = Object.assign({}, item)
      this.dialog = true
    },
    closeFormRoom () {
      this.dialog = false
      this.editedRoom = Object.assign({}, this.defaultRoom)
      this.editedIndex = -1
    }
  }
}
</script>

<style scoped>
</style>