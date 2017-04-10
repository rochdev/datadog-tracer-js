'use strict'

const HttpHeadersPropagator = require('./http_headers')
const TextMapPropagator = require('./text_map')
const BinaryPropagator = require('./binary')

module.exports = {
  HttpHeadersPropagator,
  TextMapPropagator,
  BinaryPropagator
}
