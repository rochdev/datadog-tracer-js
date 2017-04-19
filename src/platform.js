'use strict'

const now = require('performance-now')
const loadNs = now()
const loadMs = Date.now()

module.exports = {
  now () {
    return Math.round((loadMs + now() - loadNs) * 100000) / 100000
  }
}
