<template>
  <v-container fluid grid-list-md class="pa-1">
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
            <v-btn icon @click="handleFullScreen()">
              <v-icon>fullscreen</v-icon>
            </v-btn>
            <v-card color="green darken-2">
              <v-card-text class="text-xs-center pa-2">
                <h1 class="yellow--text">{{ clock }}</h1>
                <h3>{{ date }}</h3>
              </v-card-text>
            </v-card>
            <div></div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card color="white">
            <v-window v-model="step">
              <v-window-item :value="1">
                <v-card-text>
                  <v-text-field label="Nama" v-model="takerName" ></v-text-field>
                  <!-- <v-select v-model="selectedSurvey"
                    :items="surveys"
                    item-value="id"
                    item-text="name"
                    box
                    label="Pilih Survey"
                  ></v-select> -->
                </v-card-text>
              </v-window-item>

              <v-window-item v-for="(item, index) in questions" :key="index" :value="index+2">
                <v-card-text>
                  <p class="title">{{item.order}}. {{item.question}}</p>
                  <v-radio-group :mandatory="false" color="primary" v-model="currentAnswer">
                    <v-radio color="primary" v-for="itemAnswer in item.answers" :label="itemAnswer.answer" :value="itemAnswer.id" :key="itemAnswer.answer"></v-radio>
                  </v-radio-group>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="lastStep">
                <v-card-text>
                  <p class="title">Terima kasih telah berpartisipasi dalam Survey ini.</p>
                </v-card-text>
              </v-window-item>
            </v-window>
          <v-divider dark></v-divider>
          <v-card-actions>
            <v-btn :disabled="step === 1" v-if="step < lastStep" flat @click="prevStep">Sebelumnya</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" depressed @click="nextStep">{{ step === lastStep ? 'Selesai' : 'Selanjutnya' }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import Util from '@/utils/index'
import SurveyApi from '@/api/survey'

export default {
  data: () => ({
    clock: '',
    date: '',
    timer: '',
    fullScreen: false,
    step: 1,
    surveys: [],
    selectedSurvey: 0,
    selectedSurveyDetail: null,
    surveyResponse: {
      name: '',
      asAnonymous: true,
      items: []
    },
    currentAnswer: 0,
    lastStep: 0,
    takerName: ''
  }),
  computed: {
    questions () {
      return this.selectedSurveyDetail == null ? [] : this.selectedSurveyDetail.questions
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.timer = setInterval(this.setClock, 1000)
      this.date = this.moment().format('D MMMM YYYY')

      this.getActiveSurvey()
    })
  },
  methods: {
    async getSurveys () {
      let response = await SurveyApi.getSurveys()
      if (response.success) {
        this.surveys = response.data
      }
    },
    async getActiveSurvey () {
      let response = await SurveyApi.getActiveSurvey()
      if (response.success) {
        this.selectedSurveyDetail = response.data
        this.surveyResponse.items = []
        for (let i = 0; i < this.questions.length; i++) {
          this.surveyResponse.items.push({questionId: this.questions[i].id, answerId: 0})
        }
        this.lastStep = this.questions.length + 2
      }
    },
    async getSurveyQuestion () {
      let response = await SurveyApi.getSurveyDetail(this.selectedSurvey)
      if (response.success) {
        this.selectedSurveyDetail = response.data
        this.surveyResponse.items = []
        for (let i = 0; i < this.questions.length; i++) {
          this.surveyResponse.items.push({questionId: this.questions[i].id, answerId: 0})
        }
        this.lastStep = this.questions.length + 2
      }
    },
    async nextStep () {
      if (this.step === 1) {
        this.surveyResponse.name = this.takerName
      }
      this.saveCurrentAnswer()

      if (this.step - 1 === this.questions.length) {
        let response = await SurveyApi.submitSurvey(this.selectedSurveyDetail.id, this.surveyResponse)
        if (response.success) {
          this.$toast.open({ text: 'Survey berhasil disimpan.' })
        } else {
          this.$toast.open({ text: 'Error saat menyimpan survey.', type: 'error' })
        }
      }

      if (this.step === this.lastStep) {
        this.resetSurvey()
        return
      }

      this.step += 1
      this.setCurrentAnswer()
    },
    resetSurvey () {
      this.step = 1
      this.surveyResponse = {
        name: '',
        asAnonymous: true,
        items: []
      }
      this.currentAnswer = 0
    },
    prevStep () {
      this.saveCurrentAnswer()
      this.step -= 1
      this.setCurrentAnswer()
    },
    saveCurrentAnswer () {
      let prevQuestion = this.step - 1
      if (prevQuestion > 0) {
        this.surveyResponse.items[prevQuestion - 1].answerId = this.currentAnswer
      }
    },
    setCurrentAnswer () {
      let curQuestion = this.step - 1
      if (curQuestion <= this.questions.length) {
        this.currentAnswer = this.surveyResponse.items[curQuestion - 1].answerId
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
        : this.$refs.queueContainer.clientHeight - 98 - 15
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
      this.speechMessage.voice = this.queueVoiceList.find(v => {
        return v.voiceURI === this.selectedVoiceName
      })

      let qnumber = activeNumber.split('-')
      let prefix = qnumber[0]
      let number = qnumber[1]

      this.speechMessage.text = this.queueText
        .replace('{NO_ANTRIAN}', prefix + ', ' + Util.terbilang(number))
        .replace('{NAMA_UNIT}', unitName)
      this.audioIn.play()
    },
    testVoice () {
      let randomNumber = 'P-' + Math.floor(Math.random() * 999 + 1).toString()
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
        let queueSetting = JSON.parse(
          localStorage.getItem('queueDisplaySetting')
        )
        this.marqueeText = queueSetting.marqueeText
        this.mainShow = queueSetting.mainShow
        this.selectedVoiceName = queueSetting.selectedVoiceName
        this.queueText = queueSetting.queueText
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
