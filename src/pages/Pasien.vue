<template>
  <div id="patient-content">
    <v-container grid-list-xl fluid>
      <v-layout row wrap="">
        <v-flex xs12>
          <v-card>
            <v-card-title>
              <v-btn color="primary" dark @click="dialog = true">
                <v-icon dark>add</v-icon>Pasien Baru
              </v-btn>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
                @keyup.enter="getPatients"
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
              item-key="id"
            >
              <template slot="items" slot-scope="props">
                <td>
                  <v-checkbox v-model="props.selected" primary hide-details color="primary"></v-checkbox>
                </td>
                <td class="">{{ props.item.fullName }}</td>
                <td class="">{{ props.item.birthDetail }}</td>
                <td class="">{{ props.item.genderDescription }}</td>
                <td>{{ props.item.address }}</td>
                <td class="">{{ props.item.phoneNumber }}</td>
                <td class="">
                  <v-btn
                    small
                    flat
                    icon
                    color="orange"
                    @click="editPatient(props.item)"
                    class="ma-0"
                  >
                    <v-icon>create</v-icon>
                  </v-btn>
                  <v-btn
                    small
                    flat
                    icon
                    color="red"
                    @click="deletePatient(props.item)"
                    class="ma-0"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
        <v-dialog v-model="dialog" persistent scrollable max-width="700px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
              <v-spacer></v-spacer>
              <v-btn icon @click.native="closeFormPasien">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap="">
                  <v-flex xs12>
                    <v-text-field
                      label="Nama"
                      required
                      v-model="editedPatient.fullName"
                      v-validate="'required'"
                      :error-messages="errors.collect('fullName')"
                      data-vv-name="fullName"
                      data-vv-as="Nama"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      label="Tempat Lahir"
                      v-model="editedPatient.birthPlace"
                      v-validate="'required'"
                      :error-messages="errors.collect('birthPlace')"
                      data-vv-name="birthPlace"
                      data-vv-as="Tempat Lahir"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-menu
                      :close-on-content-click="false"
                      v-model="pickerMenu"
                      :nudge-right="40"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        label="Tanggal lahir"
                        v-model="editedPatient.birthDate"
                        v-validate="'required'"
                        :error-messages="errors.collect('birthDate')"
                        data-vv-name="birthDate"
                        data-vv-as="Tanggal Lahir"
                        append-icon="event"
                        readonly
                      ></v-text-field>
                      <v-date-picker @input="pickerMenu = false" v-model="editedPatient.birthDate"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12>
                    <v-select
                      :items="[{value: 'M', text: 'Laki laki'}, {value: 'F', text: 'Perempuan'}, {value: 'U', text: 'Tidak diketahui'}]"
                      label="Jenis Kelamin"
                      v-model="editedPatient.gender"
                      v-validate="'required'"
                      :error-messages="errors.collect('gender')"
                      data-vv-name="gender"
                      data-vv-as="Jenis Kelamin"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select
                      :items="['A', 'B', 'O', 'AB']"
                      label="Golongan Darah"
                      v-model="editedPatient.bloodType"
                      v-validate="'required'"
                      :error-messages="errors.collect('bloodType')"
                      data-vv-name="bloodType"
                      data-vv-as="Golongan Darah"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select
                      :items="[{value: 'P', text: 'Positif (+)'}, {value: 'N', text: 'Negatif (-)'}]"
                      label="Rhesus"
                      v-model="editedPatient.rhesusType"
                      v-validate="'required'"
                      :error-messages="errors.collect('rhesusType')"
                      data-vv-name="rhesusType"
                      data-vv-as="Rhesus"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="Alamat"
                      v-model="editedPatient.address"
                      v-validate="'required'"
                      :error-messages="errors.collect('address')"
                      data-vv-name="address"
                      data-vv-as="Alamat"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="No. Telepon"
                      v-model="editedPatient.phoneNumber"
                      v-validate="'required'"
                      :error-messages="errors.collect('phoneNumber')"
                      data-vv-name="phoneNumber"
                      data-vv-as="No. Telepon"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="No. Identitas (KTP/SIM)"
                      v-model="editedPatient.idCardNumber"
                      v-validate="'required'"
                      :error-messages="errors.collect('idCardNumber')"
                      data-vv-name="idCardNumber"
                      data-vv-as="No. Identitas"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="No. BPJS"
                      v-model="editedPatient.bpjsNumber"
                      v-validate="'required'"
                      :error-messages="errors.collect('bpjsNumber')"
                      data-vv-name="bpjsNumber"
                      data-vv-as="No. BPJS"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-for="finger in editedPatient.fingerprints"
                      :key="finger.fingerCode"
                      :value="getFingerById(finger.fingerCode)"
                      append-outer-icon="touch_app"
                      label="Sidik Jari"
                      type="text"
                      readonly
                    >
                      <div slot="append-outer" offset-y style="width: 60px;">
                        <v-tooltip bottom>
                          <v-btn small flat icon color="red" @click="deleteFingerprint(finger)" class="ma-0" slot="activator">
                            <v-icon>delete</v-icon>
                          </v-btn>
                          <span>Hapus sidik jari</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="finger.id > 0">
                          <v-btn
                            small
                            flat
                            icon
                            color="blue"
                            @click="showIdentifyDialog"
                            class="ma-0"
                            slot="activator"
                          >
                            <v-icon>touch_app</v-icon>
                          </v-btn>
                          <span>Test sidik jari</span>
                        </v-tooltip>
                      </div>
                    </v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary darken-1" flat @click="showFingerprintDialog()">Ambil Sidik Jari</v-btn>
              <v-spacer></v-spacer>
              <v-btn @click.native="closeFormPasien" flat>Tutup</v-btn>
              <v-btn color="primary darken-1" flat @click.native="savePatient">Simpan</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="fingerprintDialog" persistent max-width="500px">
          <v-card>
            <v-card-title class="headline">Pengambilan Sidik Jari</v-card-title>
            <v-window v-model="enrollmentParentStep">
              <v-window-item :value="1">
                <v-card-text>
                  <v-select :items="fingerList" v-model="fingerprintNumber" label="Sidik Jari"></v-select>
                  <span
                    class="caption grey--text text--darken-1"
                  >Pilih jari yang akan didaftarkan sidik jarinya</span>
                </v-card-text>
              </v-window-item>
              <v-window-item :value="2">
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout row wrap="">
                      <v-flex
                        xs12
                      >Letakkan jari pada mesin fingerprint dan lakukan pengambilan sampel sebanyak 4 kali.</v-flex>
                      <v-flex xs12>
                        <v-layout align-center>
                          <v-flex xs6 offset-xs3>
                            <v-img src="/static/fingerprint-an1.gif" aspect-ratio="1.3"></v-img>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex xs12>
                        <v-stepper v-model="enrollmentStep">
                          <v-stepper-header>
                            <v-stepper-step :complete="enrollmentStep > 1" step="1"></v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step :complete="enrollmentStep > 2" step="2"></v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step :complete="enrollmentStep > 3" step="3"></v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step :complete="enrollmentStep > 4" step="4"></v-stepper-step>
                          </v-stepper-header>
                        </v-stepper>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
              </v-window-item>
            </v-window>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click.native="hideFingerprintDialog">Batal</v-btn>
              <v-btn v-if="enrollmentParentStep == 1" flat @click.native="enrollmentParentStep = 2" color="primary">Selanjutnya</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="identifyDialog" persistent max-width="500px">
          <v-card>
            <v-card-title class="headline">Identifikasi Sidik Jari</v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout row wrap="">
                  <v-flex xs12>Letakkan jari pada mesin fingerprint.</v-flex>
                  <v-flex xs12>
                    <v-layout align-center>
                      <v-flex xs6 offset-xs3>
                        <v-img src="/static/fingerprint-an1.gif" aspect-ratio="1.3"></v-img>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click.native="hideIdentifyDialog">Batal</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
    /* global Fingerprint */
    /* eslint no-undef: "error" */

    import VWidget from '@/components/VWidget'
    import PatientApi from '@/api/patient'

    export default {
      components: {
        VWidget
      },
      data: () => ({
        editedIndex: -1,
        defaultPatient: {
          id: 0,
          fullName: '',
          idCardNumber: '',
          bpjsNumber: '',
          birthPlace: '',
          birthDate: '',
          gender: '',
          bloodType: '',
          rhesusType: '',
          address: '',
          phoneNumber: '',
          fingerprints: []
        },
        editedPatient: {
          id: 0,
          fullName: '',
          idCardNumber: '',
          bpjsNumber: '',
          birthPlace: '',
          birthDate: '',
          gender: '',
          bloodType: '',
          rhesusType: '',
          address: '',
          phoneNumber: '',
          fingerprints: []
        },
        search: '',
        totalRows: 0,
        rows: [],
        loading: true,
        pagination: {},
        selected: [],
        headers: [
          { text: 'Nama', align: 'left', value: 'fullName', sortable: false },
          { text: 'Tempat/Tgl. Lahir', value: 'birthDate', sortable: false },
          { text: 'Jenis Kelamin', value: 'gender', sortable: false },
          { text: 'Alamat', value: 'address', sortable: false },
          { text: 'Telp.', value: 'phoneNumber', sortable: false },
          { text: '', value: 'action' }
        ],
        dialog: false,
        pickerMenu: false,
        fingerprintDialog: false,
        fingerprintNumber: 1,
        enrollmentStep: 1,
        enrollmentParentStep: 1,
        fingerList: [
          { value: 1, text: 'Jempol Kanan' },
          { value: 2, text: 'Jempol Kiri' },
          { value: 3, text: 'Telunjuk Kanan' },
          { value: 4, text: 'Telunjuk Kiri' }
        ],
        fingerprintData: [],
        identifyDialog: false,
        fingerprintUseType: 0,
        audioBeep: null
      }),
      watch: {
        pagination: {
          handler () {
            this.getPatients()
          },
          deep: true
        }
      },
      mounted () {
        this.audioBeep = new Audio('static/sounds/beep.wav')
        this.initFingerprint()
      },
      computed: {
        formTitle () {
          return this.editedIndex === -1 ? 'Pasien Baru' : 'Edit Pasien'
        }
      },
      methods: {
        async getPatients () {
          this.loading = true
          let response = await PatientApi.getPatients(this.search, this.pagination)
          this.rows = response.data
          this.totalRows = response.pagination.TotalRecords
          this.loading = false
        },
        async deletePatient (item) {
          let res = await this.$confirm('Apakah yakin akan menghapus data?', {title: 'Warning'})
          if (res) {
            let response = await PatientApi.deletePatient(item.id)
            if (response.success) {
              this.getPatients()
            } else {
              this.$toast.open({ text: 'Terdapat kesalahan saat menghapus data pasien! Harap coba kembali.', type: 'error' })
            }
          }
        },
        async savePatient () {
          let valid = await this.$validator.validateAll()
          if (valid) {
            let response = await PatientApi.savePatient(this.editedPatient)
            let fingerData = []
            for (let i = 0; i < this.editedPatient.fingerprints.length; i++) {
              var fingerprint = this.editedPatient.fingerprints[i]
              if (fingerprint.id === 0) {
                fingerData.push(PatientApi.saveFingerprintData(this.editedPatient.id, fingerprint))
              }
            }
            await Promise.all(fingerData)
    
            if (response.success) {
              this.getPatients()
              this.closeFormPasien()
            } else {
              this.$toast.open({ text: 'Terdapat kesalahan saat menyimpan data pasien! Harap coba kembali.', type: 'error' })
            }
          }
        },
        async editPatient (item) {
          this.editedIndex = this.rows.indexOf(item)
          let response = await PatientApi.getPatient(item.id)
          if (response.success) {
            this.editedPatient = response.data
            this.dialog = true
          }
        },
        closeFormPasien () {
          this.dialog = false
          this.editedPatient = Object.assign({}, this.defaultPatient)
          this.editedIndex = -1
        },
        initFingerprint () {
          this.$fingerprint.onSamplesAcquired = this.fingerprintSampleAcquiredHandler
        },
        async showFingerprintDialog () {
          let devices = await this.$fingerprint.getInfo()
          if (devices.length > 0) {
            let deviceId = devices[0]
            this.$fingerprint.startCapture(Fingerprint.SampleFormat.Compressed, deviceId)
            this.fingerprintUseType = 0
            this.fingerprintDialog = true
          } else {
            this.$toast.open({text: 'Tidak dapat menemukan mesin fingerprint!'})
          }
        },
        hideFingerprintDialog () {
          this.$fingerprint.stopCapture()
          this.fingerprintDialog = false
          this.enrollmentStep = 1
          this.enrollmentParentStep = 1
          this.fingerprintData = []
        },
        async showIdentifyDialog () {
          let devices = await this.$fingerprint.getInfo()
          if (devices.length > 0) {
            let deviceId = devices[0]
            this.$fingerprint.startCapture(Fingerprint.SampleFormat.Compressed, deviceId)
            this.fingerprintUseType = 1
            this.identifyDialog = true
          } else {
            this.$toast.open({text: 'Tidak dapat menemukan mesin fingerprint!'})
          }
        },
        hideIdentifyDialog () {
          this.$fingerprint.stopCapture()
          this.identifyDialog = false
        },
        async fingerprintSampleAcquiredHandler (s) {
          this.audioBeep.play()
          if (this.fingerprintUseType === 0) {
            await this.enrollmentSampleHandler(s)
          } else {
            await this.identifySampleHandler(s)
          }
        },
        fingerprintQualityReportHandler (e) {

        },
        async enrollmentSampleHandler (s) {
          this.fingerprintData.push(s)
    
          this.enrollmentStep += 1
          if (this.enrollmentStep > 4) {
            let response = await PatientApi.generateFMD(this.fingerprintData)
            if (response.success) {
              this.editedPatient.fingerprints.push({ id: 0, data: response.data, fingerCode: this.fingerprintNumber })
            }
            this.hideFingerprintDialog()
          }
        },
        async identifySampleHandler (s) {
          let response = await PatientApi.identifyPatient(this.editedPatient.id, s)
          if (response.data === this.editedPatient.id) {
            this.$toast.open({ text: 'Sampel sidik jari sesuai dengan pasien!' })
          } else {
            this.$toast.open({ text: 'Sampel sidik jari tidak sesuai dengan pasien!', type: 'warning' })
          }
        },
        async deleteFingerprint (finger) {
          let res = await this.$confirm('Apakah yakin akan menghapus sidik jari yang terdaftar?', {title: 'Warning'})
          if (res) {
            if (finger.id > 0) {
              await PatientApi.deleteFingerprintData(this.editedPatient.id, finger.id)
            }
            this.editedPatient.fingerprints = this.editedPatient.fingerprints.filter(x => x.fingerCode !== finger.fingerCode)
          }
        },
        getFingerById (id) {
          return this.fingerList.find((finger) => { return finger.value === id }).text
        }
      },
      beforeDestroy () {
        this.$fingerprint.onSamplesAcquired = null
      }
    }
</script>

<style scoped>
</style>
