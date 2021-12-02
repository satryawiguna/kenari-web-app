<template>
  <v-container fluid grid-list-md fill-height class="pa-1">
    <v-layout row wrap ref="queueContainer">
      <v-flex xs12 sm9 md9>
        <video
          v-if="mainShow === 'video'"
          controls
          style="width: 100%;object-fit: cover;"
          autoplay
          muted
        >
          <source src="static/videos/1.mp4" type="video/mp4">
        </video>
        <v-carousel v-if="mainShow === 'image'" interval="10000" :height="mainShowHeight - 76">
          <v-carousel-item v-for="(item,idx) in images" :key="idx" :src="item"></v-carousel-item>
        </v-carousel>
      </v-flex>
      <v-flex xs12 sm3 md3>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card color="green" dark>
              <v-card-title>
                <div>
                  <h1 class="display-2 yellow--text">{{ clock }}</h1>
                </div>
                <v-spacer></v-spacer>
                <v-btn icon @click="settingDialog = true">
                  <v-icon>settings</v-icon>
                </v-btn>
                <v-btn icon @click="handleFullScreen()">
                  <v-icon>fullscreen</v-icon>
                </v-btn>
              </v-card-title>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card color="green" dark>
              <v-list
                two-line
                class="green"
                ref="queueList"
                dark
                style="overflow-y: auto;"
                v-bind:style="{ height: listHeight }"
              >
                <template v-for="(item, index) in activeQueues">
                  <v-list-tile :key="item.unitName">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <h3 class="yellow--text">{{ item.unitName.toUpperCase() }}</h3>
                      </v-list-tile-title>
                      <v-list-tile-sub-title>
                        <h4>Jumlah Antrian</h4>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>
                          <h3
                            class="yellow--text"
                          >{{ item.activeNumber === '' ? '-' : item.activeNumber }}</h3>
                        </v-list-tile-title>
                        <v-list-tile-sub-title>{{ item.totalUpcomingQueue }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider dark :key="index"></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-btn
              block
              round
              color="error"
              dark
              large
              @click="showIdentifyDialog"
            >Pendaftaran Menggunakan Sidik jari</v-btn>
            <v-btn block round color="warning" dark large @click="registerPatient(0)">Pendaftaran</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex d-flex xs12 align-end>
        <v-card color="primary" dark>
          <v-card-text>
            <p class="marquee">
              <span class="yellow--text title">{{ marqueeText }}</span>
            </p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="identifyDialog" persistent width="450px">
      <v-card>
        <v-card-title class="">
          <h1 class="headline">Identifikasi Sidik Jari</h1>
          <h3 class="subheading">Letakkan jari pada mesin fingerprint.</h3>
        </v-card-title>
        <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>
                <v-layout align-center>
                  <v-flex xs6 offset-xs3>
                    <v-img src="/static/fingerprint-an1.gif" aspect-ratio="1.3"></v-img>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="hideIdentifyDialog">Batal</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="settingDialog">
      <v-card>
        <v-card-title>
          <span class="headline">Pengaturan Tampilan Pendaftaran</span>
        </v-card-title>
        <v-card-text>
          <v-list three-line subheader>
            <v-subheader>Tampilan</v-subheader>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Running Text</v-list-tile-title>
                <v-list-tile-sub-title>
                  <v-text-field v-model="marqueeText" box></v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Tampilan utama</v-list-tile-title>
                <v-list-tile-sub-title>
                  <v-radio-group v-model="mainShow" row>
                    <v-radio label="Video" value="video"></v-radio>
                    <v-radio label="Gambar" value="image"></v-radio>
                  </v-radio-group>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-subheader>Printer</v-subheader>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Printer</v-list-tile-title>
                <v-list-tile-sub-title>
                  <v-select
                    v-model="selectedPrinter"
                    :items="printerList"
                    box
                  ></v-select>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat="flat" @click="settingDialog = false">Batal</v-btn>
          <v-btn color="primary" flat="flat" @click="saveSetting">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
/* global Fingerprint */
/* eslint no-undef: "error" */

import Util from '@/utils/index'
import QueueApi from '@/api/queue'
import PrintUtil from '@/utils/print'
import PatientApi from '@/api/patient'

export default {
  data: () => ({
    clock: '',
    timer: '',
    listHeight: '347px',
    activeQueues: [],
    printer: null,
    identifyDialog: false,
    identifyPatient: null,
    initialHeight: 0,
    fullScreen: false,
    marqueeText:
      'Selamat Datang di UPT. Puskesmas II Klungkung. Kami melayani dengan hati',
    settingDialog: false,
    mainShow: 'image',
    mainShowHeight: 0,
    images: [],
    audioBeep: null,
    printerList: [],
    selectedPrinter: ''

  }),
  computed: {},
  mounted () {
    this.$nextTick(function () {
      this.getActiveQueues()
      this.timer = setInterval(this.setClock, 1000)
      this.printer = new PrintUtil()
      this.printer.startConnection()
      this.printer.onConnectionActive = () => {
        this.getPrinterList()
      }

      this.$fingerprint.onSamplesAcquired = this.identifySampleHandler
      this.$hub.on('NextQueue', this.handleNextQueue)
      this.initialHeight = this.$refs.queueContainer.clientHeight
      this.resizeQueueList()
      this.audioBeep = new Audio('static/sounds/beep.wav')
      this.images = ['static/slideshow/1.jpg', 'static/slideshow/2.jpg']
    })
  },
  methods: {
    async getActiveQueues () {
      let response = await QueueApi.getCurrentQueues()
      if (response.success) {
        this.activeQueues = response.data
      }
    },
    handleFullScreen () {
      Util.toggleFullScreen()
      this.fullScreen = !this.fullScreen
      setTimeout(this.resizeQueueList, 200)
    },
    resizeQueueList () {
      let parentHeight = !this.fullScreen
        ? this.initialHeight
        : this.$refs.queueContainer.clientHeight
      this.listHeight = parentHeight - (88 + 114 + 61 + 10) + 'px'
      this.mainShowHeight = parentHeight
    },
    setClock () {
      this.clock = this.moment().format('HH:mm:ss')
    },
    async registerPatient (patientId) {
      let response = await QueueApi.addQueue(1, patientId)
      if (response.success) {
        this.getActiveQueues()
        this.printer.setPrinter(this.selectedPrinter)
        this.printer.printESCPOS(
          this.printer.generateQueuePrintContent(
            response.data.number,
            'Pendaftaran',
            this.moment().format('D MMM YYYY HH:mm:ss'),
            response.data.totalUpcomingQueue
          )
        )
      }
    },
    async showIdentifyDialog () {
      let devices = await this.$fingerprint.getInfo()
      if (devices.length > 0) {
        let deviceId = devices[0]
        this.$fingerprint.startCapture(
          Fingerprint.SampleFormat.Compressed,
          deviceId
        )
        this.identifyDialog = true
      } else {
        this.$toast.open({ text: 'Tidak dapat menemukan mesin fingerprint!' })
      }
    },
    async identifySampleHandler (s) {
      this.audioBeep.play()
      let response = await PatientApi.identifyPatient(0, s)
      if (response.success) {
        if (response.data > 0) {
          console.log('match patientId:' + response.data)
          // let responsePatient = await PatientApi.getPatient(response.data)
          // if (responsePatient.success) {
          //   this.identifyPatient = responsePatient.data
          //   this.hideIdentifyDialog()
          // }
          this.registerPatient(response.data)
          this.hideIdentifyDialog()
        } else {
          this.$toast.open({
            text:
              'Tidak dapat menemukan pasien yang cocok dengan sampel sidik jari!',
            type: 'warning'
          })
        }
      } else {
        this.$toast.open({
          text: 'Terjadi kesalahan saat identifikasi sidik jari!'
        })
        console.log('something wrong')
      }
    },
    hideIdentifyDialog () {
      this.$fingerprint.stopCapture()
      this.identifyDialog = false
    },
    handleNextQueue (queue) {
      this.getActiveQueues()
    },
    saveSetting () {
      let reqistrationSetting = {}
      reqistrationSetting.marqueeText = this.marqueeText
      reqistrationSetting.mainShow = this.mainShow
      reqistrationSetting.selectedPrinter = this.selectedPrinter

      localStorage.setItem('reqistrationSetting', JSON.stringify(reqistrationSetting))

      this.settingDialog = false
    },
    loadSetting () {
      if (localStorage.getItem('reqistrationSetting') !== null) {
        let reqistrationSetting = JSON.parse(localStorage.getItem('reqistrationSetting'))
        this.marqueeText = reqistrationSetting.marqueeText
        this.mainShow = reqistrationSetting.mainShow
        this.selectedPrinter = reqistrationSetting.selectedPrinter
      }
    },
    async getPrinterList () {
      this.printerList = await this.printer.findPrinters()
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeQueueList)
    clearInterval(this.timer)
    this.$fingerprint.onSamplesAcquired = null
    this.$hub.off('NextQueue', this.handleNextQueue)
    this.printer.onConnectionActive = null
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p.marquee {
  margin: 0;
  text-align: center;
  /* Starting position */
  -moz-transform: translateX(100%);
  -webkit-transform: translateX(100%);
  transform: translateX(100%);
  /* Apply animation to this element */
  -moz-animation: scroll-left 25s linear infinite;
  -webkit-animation: scroll-left 25s linear infinite;
  animation: scroll-left 25s linear infinite;
}
/* Move it (define the animation) */
@-moz-keyframes scroll-left {
  0% {
    -moz-transform: translateX(100%);
  }
  100% {
    -moz-transform: translateX(-100%);
  }
}
@-webkit-keyframes scroll-left {
  0% {
    -webkit-transform: translateX(100%);
  }
  100% {
    -webkit-transform: translateX(-100%);
  }
}
@keyframes scroll-left {
  0% {
    -moz-transform: translateX(100%); /* Browser bug fix */
    -webkit-transform: translateX(100%); /* Browser bug fix */
    transform: translateX(100%);
  }
  100% {
    -moz-transform: translateX(-100%); /* Browser bug fix */
    -webkit-transform: translateX(-100%); /* Browser bug fix */
    transform: translateX(-100%);
  }
}
</style>
