/* global Fingerprint */
/* eslint no-undef: "error" */

export default function FingerprintSdk () {
  let _instance = this
  this.operationToRestart = null
  this.onDeviceConnected = null
  this.onDeviceDisconnected = null
  this.onCommunicationFailed = null
  this.onSamplesAcquired = null
  this.onQualityReported = null

  this.currentFormat = Fingerprint.SampleFormat.Compressed
  this.acquisitionStarted = false
  this.sdk = new Fingerprint.WebApi()

  this.sdk.onDeviceConnected = function (e) {
    if (_instance.onDeviceConnected !== null) {
      _instance.onDeviceConnected()
    }
    console.log('Scan your finger')
  }
  this.sdk.onDeviceDisconnected = function (e) {
    if (_instance.onDeviceDisconnected !== null) {
      _instance.onDeviceDisconnected()
    }
    console.log('Device disconnected')
  }
  this.sdk.onCommunicationFailed = function (e) {
    if (_instance.onCommunicationFailed !== null) {
      _instance.onCommunicationFailed()
    }
    console.log('Communinication Failed')
  }
  this.sdk.onSamplesAcquired = function (s) {
    let result = ''
    var samples = JSON.parse(s.samples)

    if (_instance.currentFormat === Fingerprint.SampleFormat.PngImage) {
      result = Fingerprint.b64UrlTo64(samples[0])
    } else {
      var sampleData = Fingerprint.b64UrlTo64(samples[0].Data)
      if (_instance.currentFormat === Fingerprint.SampleFormat.Intermediate) {
        result = sampleData
      } else if (_instance.currentFormat === Fingerprint.SampleFormat.Raw || _instance.currentFormat === Fingerprint.SampleFormat.Compressed) {
        var decodedData = JSON.parse(Fingerprint.b64UrlToUtf8(sampleData))
        result = Fingerprint.b64UrlTo64(decodedData.Data)
      } else {
        console.log('Format Error')
      }
    }

    if (_instance.onSamplesAcquired !== null) {
      _instance.onSamplesAcquired(result)
    }
    console.log('sample acquired')
  }
  this.sdk.onQualityReported = function (e) {
    if (_instance.onQualityReported !== null) {
      _instance.onQualityReported(e)
    }
    console.log(Fingerprint.QualityCode[(e.quality)])
  }
}

FingerprintSdk.prototype.startCapture = function (currentFormat, reader) {
  if (this.acquisitionStarted) { return }
  var _instance = this
  this.operationToRestart = this.startCapture
  this.currentFormat = currentFormat

  this.sdk.startAcquisition(currentFormat, reader).then(function () {
    _instance.acquisitionStarted = true
  }, function (error) {
    console.log(error.message)
  })
}

FingerprintSdk.prototype.stopCapture = function () {
  if (!this.acquisitionStarted) { return }
  var _instance = this

  this.sdk.stopAcquisition().then(function () {
    _instance.acquisitionStarted = false
  }, function (error) {
    console.log(error.message)
  })
}

FingerprintSdk.prototype.getInfo = function () {
  return this.sdk.enumerateDevices()
}

FingerprintSdk.prototype.getDeviceInfoWithID = function (uid) {
  return this.sdk.getDeviceInfo(uid)
}
