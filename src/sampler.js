'use strict'

class DatadogSampler {
  isSampled (span) {
    return true
  }
}

module.exports = DatadogSampler
