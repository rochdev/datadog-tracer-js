'use strict'

const TextMapPropagator = require('./text_map')

class HttpHeadersPropagator {
  inject (spanContext, carrier) {
    const textMapPropagator = new TextMapPropagator()
    textMapPropagator.inject(spanContext, carrier)
  }

  extract (carrier) {
    const textMapPropagator = new TextMapPropagator()
    return textMapPropagator.extract(carrier)
  }
}

module.exports = HttpHeadersPropagator
