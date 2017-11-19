'use strict'

const now = require('performance-now')
const dateNow = require('./date_now')
const crypto = require('./crypto')
const Uint32Array = global.Uint32Array || require('typedarray').Uint32Array
const Promise = global.Promise || require('es6-promise')
const Long = require('long')
const loadNs = now()
const loadMs = dateNow()

module.exports = {
  now () {
    return Math.round((loadMs + now() - loadNs) * 100000) / 100000
  },

  id () {
    const array = new Uint32Array(2)
    crypto.getRandomValues(array)

    return new Long(array[0], array[1], true)
  },

  request (options) {
    options = Object.assign({
      headers: {}
    }, options)

    options.headers['Content-Type'] = 'application/json'

    return new Promise((resolve, reject) => {
      const xhr = new global.XMLHttpRequest()
      const url = `${options.protocol}//${options.hostname}:${options.port}${options.path}`

      xhr.onload = function () {
        if (this.status >= 200 && this.status <= 299) {
          resolve()
        }
      }

      xhr.onerror = () => reject(new TypeError('Network request failed'))
      xhr.ontimeout = () => reject(new TypeError('Network request failed'))

      xhr.open(options.method, url, true)

      Object.keys(options.headers).forEach((name) => {
        xhr.setRequestHeader(name, options.headers[name])
      })

      xhr.send(options.data)
    })
  }
}
