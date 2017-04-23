'use strict'

const now = require('performance-now')
const Long = require('long')
const loadNs = now()
const loadMs = Date.now()

module.exports = {
  now () {
    return Math.round((loadMs + now() - loadNs) * 100000) / 100000
  },

  id () {
    return new Long(random(), random(), true)
  }
}

function random () {
  let number = 0

  for (let i = 0; i < 4; i++) {
    number += Math.floor(Math.random() * 255) << (i * 8)
  }

  return number
}
