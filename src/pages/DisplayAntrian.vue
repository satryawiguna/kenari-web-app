<template>
  <v-container fluid grid-list-md fill-height class="pa-1">
    <v-layout row wrap ref="queueContainer">
      <v-flex xs12>
        <v-card color="green" dark>
          <v-card-title class="pa-2">
            <img src="static/logo.png">
            <div class="ml-3">
              <h1>UPT. PUSKESMAS KLUNGKUNG II</h1>
              <h3>Jl. Raya Besakih No.16, Selat, Kec. Klungkung, Kab. Klungkung</h3>
            </div>
            <v-spacer></v-spacer>
            <v-btn icon @click="settingDialog = true">
              <v-icon>settings</v-icon>
            </v-btn>
            <v-btn icon @click="handleFullScreen()">
              <v-icon>fullscreen</v-icon>
            </v-btn>
            <v-card color="green darken-2">
              <v-card-text class="text-xs-center pa-2">
                <h1 class="yellow--text">{{ clock }}</h1>
                <h3>{{ date }}</h3>
              </v-card-text>
            </v-card>
            <div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card color="light-green accent-2" dark :height="sideCardHeight">
          <v-layout row wrap class="pa-2">
            <v-flex xs12 sm8 md8>
              <video
                v-if="mainShow === 'video'"
                controls
                style="width: 100%; object-fit: cover;"
                autoplay
                muted
              >
                <source src="static/videos/1.mp4" type="video/mp4">
              </video>
              <v-carousel
                v-if="mainShow === 'image'"
                interval="10000"
                :height="sideCardHeight - 24"
              >
                <v-carousel-item v-for="(item,i) in images" :key="i" :src="item"></v-carousel-item>
              </v-carousel>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-layout row wrap>
                <v-flex v-for="queue in activeQueues" :key="queue.id" xs12 sm6 md6>
                  <v-card color="light-green" dark>
                    <v-card-title>
                      <h2>{{ queue.unitName }}</h2>
                    </v-card-title>
                    <v-divider light></v-divider>
                    <v-card-text>
                      <h2>{{ queue.activeNumber == '' ? '-' : queue.activeNumber }}</h2>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
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
    <v-dialog v-model="queueDialog" max-width="90%">
      <v-card color="green" dark height="90%">
        <v-card-text>
          <v-container grid-list-md>
            <v-layout row wrap align-center>
              <v-flex xs12>
                <p class="display-4 text-xs-center font-weight-black">{{ calledQueue.number }}</p>
                <p class="display-3 text-xs-center">{{ calledQueue.unitName }}</p>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="settingDialog">
      <v-card>
        <v-card-title>
          <span class="headline">Pengaturan Tampilan Antrian</span>
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
            <v-subheader>Antrian</v-subheader>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Suara Antrian</v-list-tile-title>
                <v-list-tile-sub-title>
                  <v-select
                    v-model="selectedVoiceName"
                    :items="queueVoiceList"
                    item-text="name"
                    item-value="voiceURI"
                    box
                  ></v-select>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Text Antrian</v-list-tile-title>
                <v-list-tile-sub-title>
                  <v-text-field v-model="queueText" box></v-text-field>
                  <v-btn large color="primary" @click="testVoice"><v-icon dark>volume_up</v-icon></v-btn>
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
import Util from '@/utils/index'
import QueueApi from '@/api/queue'

export default {
  data: () => ({
    clock: '',
    date: '',
    timer: '',
    activeQueues: [],
    queueDialog: false,
    fullScreen: false,
    initialHeight: 0,
    sideCardHeight: 0,
    selectedVoice: null,
    calledQueue: { number: '', unitName: '' },
    images: ['static/slideshow/1.jpg', 'static/slideshow/2.jpg'],
    marqueeText:
      'Selamat Datang di UPT. Puskesmas II Klungkung. Melayani dengan hati',
    mainShow: 'image',
    settingDialog: false,
    queueVoiceList: [],
    selectedVoiceName: 'Microsoft Andika - Indonesian (Indonesia)',
    queueText: 'Nomor antrian, {NO_ANTRIAN}, harap datang, ke {NAMA_UNIT}',
    audioIn: '',
    audioOut: '',
    speechMessage: null
  }),
  computed: {},
  mounted () {
    this.$nextTick(function () {
      this.loadSetting()
      this.getActiveQueues()

      this.timer = setInterval(this.setClock, 1000)
      this.$hub.on('NextQueue', this.handleNextQueue)
      this.initialHeight =
        this.$refs.queueContainer.clientHeight - 98 - 55 - 24
      this.sideCardHeight = this.initialHeight
      this.date = this.moment().format('D MMMM YYYY')

      this.loadVoices()
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
      setTimeout(this.resizeSideCard, 200)
    },
    resizeSideCard () {
      let parentHeight = !this.fullScreen
        ? this.initialHeight
        : this.$refs.queueContainer.clientHeight - 98 - 55 - 24
      this.sideCardHeight = parentHeight
    },
    setClock () {
      this.clock = this.moment().format('HH:mm:ss')
    },
    async showQueueDialog (number, unit) {
      this.queueDialog = true
      this.speakQueue(number, unit)
    },
    hideQueueDialog () {
      this.queueDialog = false
    },
    handleNextQueue (queue) {
      let unitName = this.activeQueues.find(unit => {
        return unit.id === queue.group
      }).unitName
      this.calledQueue = { number: queue.newNumber, unitName: unitName }
      this.showQueueDialog(queue.newNumber, unitName)
      this.getActiveQueues()
    },
    loadVoices () {
      this.audioIn = new Audio('static/sounds/in.wav')
      this.audioOut = new Audio('static/sounds/out.wav')

      this.populateVoiceList()
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = this.populateVoiceList
      }

      this.speechMessage = new SpeechSynthesisUtterance()
      this.speechMessage.rate = 8 / 10
      this.speechMessage.pitch = 1

      this.speechMessage.onend = () => {
        this.hideQueueDialog()
        this.audioOut.play()
      }

      this.audioIn.addEventListener('ended', () => {
        speechSynthesis.speak(this.speechMessage)
      })
    },
    populateVoiceList () {
      let voices = speechSynthesis.getVoices()
      if (voices.length > 0 && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = null
        this.queueVoiceList = voices

        this.selectedVoice = voices.find(voice => {
          return voice.lang === 'id-ID'
        })
        if (this.selectedVoice === undefined) {
          this.selectedVoice = voices[0]
        }
      }
    },
    speakQueue (activeNumber, unitName) {
      this.speechMessage.voice = this.queueVoiceList.find(v => { return v.voiceURI === this.selectedVoiceName })

      let qnumber = activeNumber.split('-')
      let prefix = qnumber[0]
      let number = qnumber[1]

      this.speechMessage.text = this.queueText.replace('{NO_ANTRIAN}', prefix + ', ' + Util.terbilang(number)).replace('{NAMA_UNIT}', unitName)
      this.audioIn.play()
    },
    testVoice () {
      let randomNumber = 'P-' + Math.floor((Math.random() * 999) + 1).toString()
      this.speakQueue(randomNumber, 'Pendaftaran')
    },
    saveSetting () {
      let queueSetting = {}
      queueSetting.marqueeText = this.marqueeText
      queueSetting.mainShow = this.mainShow
      queueSetting.selectedVoiceName = this.selectedVoiceName
      queueSetting.queueText = this.queueText

      localStorage.setItem('queueDisplaySetting', JSON.stringify(queueSetting))

      this.settingDialog = false
    },
    loadSetting () {
      if (localStorage.getItem('queueDisplaySetting') !== null) {
        let queueSetting = JSON.parse(localStorage.getItem('queueDisplaySetting'))
        this.marqueeText = queueSetting.marqueeText
        this.mainShow = queueSetting.mainShow
        this.selectedVoiceName = queueSetting.selectedVoiceName
        this.queueText = queueSetting.queueText
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.$hub.off('NextQueue', this.handleNextQueue)
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
