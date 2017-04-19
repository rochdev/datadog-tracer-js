'use strict'

const Long = require('long')
const DatadogSpanContext = require('../span_context')

class TextMapPropagator {
  inject (spanContext, carrier) {
    Object.assign(carrier, {
      'dd-tracer-traceid': spanContext.traceId.toString(),
      'dd-tracer-spanid': spanContext.spanId.toString(),
      'dd-tracer-sampled': String(spanContext.sampled)
    })

    spanContext.baggage && Object.keys(spanContext.baggage).forEach(key => {
      carrier[`dd-baggage-${key}`] = spanContext.baggage[key]
    })
  }

  extract (carrier) {
    const baggage = {}

    Object.keys(carrier).forEach(key => {
      const match = key.match(/^dd-baggage-(.+)$/)

      if (match) {
        baggage[match[1]] = carrier[key]
      }
    })

    try {
      return new DatadogSpanContext({
        traceId: Long.fromString(carrier['dd-tracer-traceid'], true),
        spanId: Long.fromString(carrier['dd-tracer-spanid'], true),
        sampled: carrier['dd-tracer-sampled'] === 'true',
        baggage
      })
    } catch (e) {
      return null
    }
  }
}

module.exports = TextMapPropagator
