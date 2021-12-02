<template>
    <div id="survey-content">
        <v-container grid-list-xl fluid>
            <v-layout row wrap="">
                <v-flex xs12>
                    <v-card>
                        <v-card-title>
                            <v-dialog v-model="dialog" persistent scrollable max-width="700px">
                                <v-btn slot="activator" color="primary" dark>
                                    <v-icon dark>add</v-icon>
                                    Survey Baru
                                </v-btn>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">{{ formTitle }}</span>
                                        <v-spacer></v-spacer>
                                        <v-btn icon @click.native="closeFormSurvey">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container grid-list-md>
                                            <v-layout wrap="">
                                                <v-flex xs12 sm12 md12>
                                                    <v-text-field
                                                            label="Nama"
                                                            v-model="editedSurvey.name"
                                                            v-validate="'required'" :error-messages="errors.collect('name')" data-vv-name="name" data-vv-as="Nama"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-text-field label="Deskripsi" v-model="editedSurvey.description"></v-text-field>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-switch :label="'Aktif'"
                                                              v-model="editedSurvey.isActive"
                                                    ></v-switch>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn @click.native="closeFormSurvey" flat>Tutup</v-btn>
                                        <v-btn color="primary darken-1" flat @click.native="saveSurvey">Simpan</v-btn>
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
                                <td class=""><router-link to="/master/surveydetail">{{ props.item.name }}</router-link></td>
                                <td class="">{{ props.item.description }}</td>
                                <td class="is-active">
                                    <v-chip v-if="props.item.isActive == 1" color="primary">Enable</v-chip>
                                    <v-chip v-if="props.item.isActive == 0" color="red">Disable</v-chip>
                                </td>
                                <td class="">
                                    <v-btn small flat icon color="orange" @click="editSurvey(props.item)">
                                        <v-icon>create</v-icon>
                                    </v-btn>
                                    <v-btn small flat icon color="red" @click="deleteSurvey(props.item)">
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
import SurveyApi from '@/api/survey'

export default {
  components: {
    VWidget
  },
  data: () => ({
    editedIndex: -1,
    defaultSurvey: {
      id: 0,
      name: '',
      description: '',
      isActive: ''
    },
    editedSurvey: {
      id: 0,
      name: '',
      description: '',
      isActive: ''
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
      { text: 'Aktif', value: 'isActive' },
      { text: '', value: 'action' }
    ],
    dialog: false,
    pickerMenu: false
  }),
  watch: {
    pagination: {
      handler () {
        this.getSurvey()
      },
      deep: true
    }
  },
  mounted () {
    this.getSurvey()
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Survey Baru' : 'Edit Survey'
    }
  },
  methods: {
    async getSurvey () {
      this.loading = true
      let response = await SurveyApi.getSurvey(this.search, this.pagination)
      this.rows = response.data
      this.totalRows = response.pagination.TotalRecords
      this.loading = false
    },
    async saveSurvey () {
      let valid = await this.$validator.validateAll()
      if (valid) {
        let response = await SurveyApi.saveSurvey(this.editedSurvey)
        if (response.success) {
          this.getSurvey()
          this.closeFormSurvey()
        } else {
          this.$toast.open({ text: 'Terdapat kesalahan saat menyimpan data pasien! Harap coba kembali.', type: 'error' })
        }
      }
    },
    async deleteSurvey (item) {
      let res = await this.$confirm('Apakah yakin akan menghapus data?', {title: 'Warning'})
      if (res) {
        let response = await SurveyApi.deleteSurvey(item.id)
        if (response.success) {
          this.getSurvey()
        } else {
          this.$toast.open({ text: 'Terdapat kesalahan saat menghapus data pasien! Harap coba kembali.', type: 'error' })
        }
      }
    },
    editSurvey (item) {
      this.editedIndex = this.rows.indexOf(item)
      this.editedSurvey = Object.assign({}, item)
      this.dialog = true
    },
    closeFormSurvey () {
      this.dialog = false
      this.editedSurvey = Object.assign({}, this.defaultSurvey)
      this.editedIndex = -1
    }
  }
}
</script>

<style scoped>
.is-active span {
  color: #ffffff;
}
</style>
