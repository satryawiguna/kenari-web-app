<template>
  <div id="page-alerts">
    <v-container grid-list-lg fluid>
      <v-layout row wrap="">
        <v-flex xs12>
          <v-card>
            <v-card-title primary-title>
              <v-select
                v-model="selectedUnit"
                :items="units"
                item-text="name"
                item-value="id"
                label="Pilih Unit"
              ></v-select>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs12 sm4 md4>
          <v-card color="lime" class="white--text">
            <v-card-title primary-title>
              <div class="title text-uppercase">Sisa Antrian</div>
            </v-card-title>
            <v-divider light></v-divider>
            <v-card-text>
              <span class="title">{{ queueLeft }}</span>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm4 md4>
          <v-card color="orange" class="white--text">
            <v-card-title primary-title>
              <div class="title text-uppercase">Dilayani</div>
            </v-card-title>
            <v-divider light></v-divider>
            <v-card-text>
              <span class="title">{{ numberServed }}</span>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm4 md4>
          <v-card color="pink" class="white--text">
            <v-card-title primary-title>
              <div class="title text-uppercase">Total Pengunjung</div>
            </v-card-title>
            <v-divider light></v-divider>
            <v-card-text>
              <span class="title">{{ totalRows }}</span>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12>
          <v-card color="blue" class="white--text">
            <v-card-title primary-title>
              <span class="title text-uppercase">Antrian Sekarang</span>
            </v-card-title>
            <v-divider light></v-divider>
            <v-card-text>
              <v-list class="blue" dark>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ currentQueue == undefined ? '' : currentQueue.number }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{ currentQueue == undefined ? '' : currentQueue.patientname }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-spacer></v-spacer>
                  <v-list-tile-action>
                    <v-tooltip bottom>
                      <v-btn icon slot="activator">
                        <v-icon>person_add</v-icon>
                      </v-btn>
                      <span>Daftarkan Pasien</span>
                    </v-tooltip>
                  </v-list-tile-action>
                  <v-list-tile-action>
                    <v-tooltip bottom>
                      <v-btn icon slot="activator" @click="recallCurrent">
                        <v-icon>record_voice_over</v-icon>
                      </v-btn>
                      <span>Panggil Pasien</span>
                    </v-tooltip>
                  </v-list-tile-action>
                  <v-list-tile-action>
                    <v-menu
                      v-model="transferMenu"
                      :close-on-content-click="false"
                      :nudge-width="200"
                      bottom
                    >
                      <v-tooltip bottom slot="activator">
                        <v-btn icon slot="activator">
                          <v-icon>exit_to_app</v-icon>
                        </v-btn>
                        <span>Transfer ke Unit lain</span>
                      </v-tooltip>
                      <v-card>
                        <v-card-title>Transfer Pasien</v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                          <v-select
                            v-model="transferUnit"
                            :items="units"
                            item-text="name"
                            item-value="id"
                            label="Pilih Unit"
                          ></v-select>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat @click="transferMenu = false">Batal</v-btn>
                          <v-btn color="primary" flat @click="transferPatientToUnit">Transfer</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-menu>
                  </v-list-tile-action>
                  <v-list-tile-action>
                    <v-tooltip bottom>
                      <v-btn icon slot="activator" @click="callNext">
                        <v-icon>arrow_forward</v-icon>
                      </v-btn>
                      <span>Panggil antrian berikutnya</span>
                    </v-tooltip>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="rows"
            :total-items="totalRows"
            :loading="loading"
            item-key="id"
            hide-actions
          >
            <template slot="items" slot-scope="props">
              <tr
                :class="{ 'queue-active': props.item.status === 'Active', 'queue-done': props.item.status === 'Done' }"
              >
                <td class="">{{ props.item.index }}.</td>
                <td class="">{{ props.item.number }}</td>
                <td class="">
                  <a href="#">{{ props.item.patientName }}</a>
                </td>
                <td class="">
                  <v-chip v-if="props.item.status === 'Upcoming'" color="blue" text-color="white">
                    <v-avatar>
                      <v-icon>watch_later</v-icon>
                    </v-avatar>Menunggu
                  </v-chip>
                  <v-chip v-if="props.item.status === 'Active'" color="orange" text-color="white">
                    <v-avatar>
                      <v-icon>sentiment_satisfied</v-icon>
                    </v-avatar>Aktif
                  </v-chip>
                  <v-chip v-if="props.item.status === 'Done'" color="green" text-color="white">
                    <v-avatar>
                      <v-icon>check_circle</v-icon>
                    </v-avatar>Selesai
                  </v-chip>
                </td>
                <td class="">
                  <v-btn small flat icon color="blue" v-if="props.item.patientId === 0">
                    <v-icon>add</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>

import RoomApi from '@/api/room'
import QueueApi from '@/api/queue'
import PrintUtil from '@/utils/print'

export default {

  components: {
  },
  data: () => ({
    units: [],
    selectedUnit: 0,
    showNav: true,
    headers: [
      { text: 'No.', value: 'index', sortable: false },
      { text: 'No. Antrian', value: 'number', sortable: false },
      { text: 'Pasien', value: 'patienName', sortable: false },
      { text: 'Status', value: 'status', sortable: false },
      { text: '', value: 'action', sortable: false }
    ],
    loading: false,
    totalRows: 0,
    rows: [],
    transferMenu: false,
    transferUnit: 0

  }),
  computed: {
    currentQueue: function () {
      return this.rows.find((item) => { return item.status === 'Active' })
    },
    queueLeft: function () {
      return this.rows.filter((item) => { return item.status === 'Upcoming' }).length
    },
    numberServed: function () {
      return this.rows.filter((item) => { return item.status === 'Done' }).length
    },
    transferUnitName: function () {
      return this.units.find((item) => { return item.id === this.transferUnit }).name
    },
    nextQueue: function () {
      return this.rows.find((item) => { return item.status === 'Upcoming' })
    }
  },
  methods: {
    async getUnits () {
      let response = await RoomApi.getAllRoom()
      if (response.success) {
        this.units = response.data
        this.selectedUnit = this.units.length > 0 ? this.units[0].id : 0
      }
    },
    async getUnitQueues () {
      this.loading = true
      let response = await QueueApi.getQueueByUnit(this.selectedUnit)
      if (response.success) {
        this.rows = response.data.items
        this.totalRows = response.data.items.length
      }
      this.loading = false
    },
    async callNext () {
      if (this.nextQueue != null) {
        await QueueApi.pickQueue(this.selectedUnit, this.nextQueue.index)
        this.getUnitQueues()
      }
    },
    async recallCurrent () {
      let response = await QueueApi.recallCurrentQueue(this.selectedUnit)
      if (response.success) {
        this.getUnitQueues()
      }
    },
    handleNewQueue (queue) {
      this.getUnitQueues()
    },
    async transferPatientToUnit () {
      let response = await QueueApi.addQueue(this.transferUnit, this.currentQueue.patientId)
      if (response.success) {
        await this.getUnitQueues()
        this.printer.setPrinter('POS-58 (copy 2)')
        this.printer.printESCPOS([{ type: 'raw', data: this.generatePrintContent(this.currentQueue, this.transferUnitName), options: { language: 'ESCPOS' } }])
      }
      this.transferMenu = false
    },
    generatePrintContent (data, unit) {
      return this.templatePrint
        .replace('{title}', this.dataPrint.title)
        .replace('{number}', data.number)
        .replace('{unit}', unit)
        .replace('{date}', new Date().toLocaleDateString())
        .replace('{upcomingQueue}', 'Jumlah Antrian: -')
    }
  },
  async mounted () {
    await this.getUnits()
    this.$hub.on('AddQueue', this.handleNewQueue)
    this.$hub.on('NextQueue', this.handleNewQueue)
    this.printer = new PrintUtil()
    this.printer.startConnection()
  },
  watch: {
    selectedUnit: function (cValue, oValue) {
      this.getUnitQueues()
    }
  },
  beforeDestroy () {
    this.$hub.off('AddQueue', this.handleNewQueue)
    this.$hub.off('NextQueue', this.handleNewQueue)
  }
}
</script>

<style>
.queue-active {
  background: #dddddd;
}
.queue-done {
  opacity: 0.5;
}
</style>
