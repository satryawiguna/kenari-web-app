/* global qz */
/* eslint no-undef: "error" */

import axios from 'axios'

export default function PrintUtil () {
  let _instance = this
  this.cfg = null
  this.queuePrintTemplate = '\x1B' + '\x40' +         // init
  '\x1B' + '\x61' + '\x31' + // center align
  '{title}' +
  '\x0A' + '\x0A' + // line break
  '\x1B' + '\x45' + '\x0D' + // bold on
  '\x1D' + '\x21' + '\x11' + // double font size
  '{number}' +
  '\x0A' + '\x0A' + // line break
  '\x1D' + '\x21' + '\x00' + // normal text
  '{unit}' +
  '\x0A' + '\x0A' + // line break
  '\x1D' + '\x21' + '\x00' + // normal text
  '\x1B' + '\x45' + '\x0A' + // bold off
  '{date}' +
  '\x0A' + '\x0A' + // line break
  '{upcomingQueue}' +
  '\x0A' + '\x0A' + // line break
  '\x0A' + '\x0A' + // line break
  '\x1B' + '\x69' // cut paper

  this.onConnectionActive = null

  qz.security.setCertificatePromise(async function (resolve, reject) {
    try {
      let response = await axios.get('static/scripts/qz-tray/override.crt')
      resolve(response.data)
    } catch (err) {
      reject(err)
    }
  })

  qz.websocket.setClosedCallbacks(function (evt) {
    console.log('Inactive')
    console.log(evt)
  })
  qz.websocket.setErrorCallbacks(_instance.handleConnectionError)

  this.handleConnectionError = (err) => {
    console.error(err)
  }
}

PrintUtil.prototype.startConnection = function (config) {
  let _instance = this
  if (!qz.websocket.isActive()) {
    qz.websocket.connect(config).then(function () {
      console.log('Active')
      if (_instance.onConnectionActive !== null) {
        _instance.onConnectionActive()
      }
    }).catch(_instance.handleConnectionError)
  } else {
    console.log('An active connection with QZ already exists.', 'alert-warning')
  }
}

PrintUtil.prototype.endConnection = function () {
  let _instance = this

  if (qz.websocket.isActive()) {
    qz.websocket.disconnect().then(function () {
      console.log('Inactive')
    }).catch(_instance.handleConnectionError)
  } else {
    console.log('No active connection with QZ exists.', 'alert-warning')
  }
}

PrintUtil.prototype.findPrinter = function (query, set) {
  let _instance = this
  qz.printers.find(query).then(function (data) {
    console.log('<strong>Found:</strong> ' + data)
    if (set) { _instance.setPrinter(data) }
  }).catch(_instance.displayError)
}

PrintUtil.prototype.setPrinter = function (printer) {
  var _instance = this
  var cf = _instance.getUpdatedConfig()
  cf.setPrinter(printer)
}

PrintUtil.prototype.getUpdatedConfig = function () {
  var _instance = this
  if (_instance.cfg == null) {
    _instance.cfg = qz.configs.create(null)
  }
  // Todo: create method to reconfigure printer
  return _instance.cfg
}

PrintUtil.prototype.displayError = function (err) {
  console.error(err)
}

PrintUtil.prototype.printESCPOS = function (printData) {
  let _instance = this
  var config = _instance.getUpdatedConfig()
  qz.print(config, [{ type: 'raw', data: printData, options: { language: 'ESCPOS' } }]).catch(_instance.displayError)
}

PrintUtil.prototype.setQueuePrintTemplate = function (template) {
  this.queuePrintTemplate = template
}

PrintUtil.prototype.generateQueuePrintContent = function (number, unit, date, upcomingQueue) {
  return this.queuePrintTemplate
    .replace('{title}', 'UPT. Puskesmas Klungkung II')
    .replace('{number}', number)
    .replace('{unit}', unit)
    .replace('{date}', date)
    .replace('{upcomingQueue}', 'Jumlah Antrian: ' + upcomingQueue)
}

PrintUtil.prototype.findPrinters = async function () {
  let _instance = this
  try {
    let printers = await qz.printers.find()
    return printers
  } catch (e) {
    _instance.displayError(e)
    return []
  }
}
