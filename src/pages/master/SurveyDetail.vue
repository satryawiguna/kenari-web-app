<template>
    <div id="survey-detail-content">
        <v-container grid-list-xl fluid>
            <v-layout row wrap="">
                <v-flex xs12>
                    <v-card>
                        <v-card-title>
                            <v-dialog v-model="dialog" persistent scrollable max-width="700px">
                                <v-btn slot="activator" color="primary" dark>
                                    <v-icon dark>add</v-icon>
                                    Survey Detail Baru
                                </v-btn>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">{{ formTitle }}</span>
                                        <v-spacer></v-spacer>
                                        <v-btn icon @click.native="closeFormSurveyDetail">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container grid-list-md>
                                            <v-layout wrap="">
                                                <v-flex xs12 sm12 md12>
                                                    <v-text-field
                                                            label="Pertanyaan"
                                                            required
                                                            v-model="editedSurveyDetail.question"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-text-field label="Nama Bagian" v-model="editedSurveyDetail.sectionName"></v-text-field>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-text-field label="Nilai Berat" v-model="editedSurveyDetail.weightValue"></v-text-field>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <NumberInputSpinner :min="0" :max="10" :step="2" :integerOnly="true" v-model="editedSurveyDetail.order"/>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card-text>
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
                                <td class="">{{ props.item.question }}</td>
                                <td class="">{{ props.item.sectionName }}</td>
                                <td class="">{{ props.item.weightValue }}</td>
                                <td class="">{{ props.item.order }}</td>
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
    import SurveyDetailApi from '@/api/survey-detail'

    export default {
      components: {
      },
      data: () => ({
        editedIndex: -1,
        defaultSurveyDetail: {
          surveyId: '',
          question: '',
          sectionName: '',
          weightValue: '',
          order: ''
        },
        editedSurveyDetail: {
          surveyId: '',
          question: '',
          sectionName: '',
          weightValue: '',
          order: ''
        },
        search: '',
        totalRows: 0,
        rows: [],
        loading: true,
        pagination: {},
        selected: [],
        headers: [
                {text: 'Pertanyaan', align: 'left', value: 'question'},
                {text: 'Nama Bagian', value: 'sectionName'},
                {text: 'Nilai Berat', value: 'weightValue'},
                {text: 'Urutan', value: 'order'},
                {text: '', value: 'action'}
        ],
        dialog: false,
        pickerMenu: false
      }),
      watch: {
        pagination: {
          handler () {
            this.getSurveyDetail()
          },
          deep: true
        }
      },
      mounted () {
        this.getSurveyDetail()
      },
      computed: {
        formTitle () {
          return this.editedIndex === -1 ? 'Survey Detail Baru' : 'Edit Survey Detail'
        }
      },
      methods: {
        async getSurveyDetail () {
          this.loading = true
          let data = await SurveyDetailApi.getSurveyDetail(this.search, this.pagination)
          this.rows = data.items
          this.totalRows = data.total
          this.loading = false
        },
        async deleteSurveyDetail (item) {
          let res = await this.$confirm('Apakah yakin akan menghapus data?', {title: 'Warning'})
          if (res) {
                    // code hapus pasien disini
          }
        },
        editSurveyDetail (item) {
          this.editedIndex = this.rows.indexOf(item)
          this.editedSurveyDetail = Object.assign({}, item)
          this.dialog = true
        },
        closeFormSurveyDetail () {
          this.dialog = false
          this.editedSurveyDetail = Object.assign({}, this.defaultSurveyDetail)
          this.editedIndex = -1
        },
        saveFormSurveyDetail () {
                // save survey here
          this.closeFormSurveyDetail()
        }
      }
    }
</script>

<style scoped>

</style>