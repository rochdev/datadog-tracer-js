'use strict'

const DatadogSpanContext = require('../span_context')

class TextMapPropagator {
  inject (spanContext, carrier) {
    Object.assign(carrier, {
      'dd-tracer-traceid': spanContext.traceId,
      'dd-tracer-spanid': spanContext.spanId,
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

    return new DatadogSpanContext({
      traceId: carrier['dd-tracer-traceid'],
      spanId: carrier['dd-tracer-spanid'],
      sampled: carrier['dd-tracer-sampled'] === 'true',
      baggage
    })
  }
}

module.exports = TextMapPropagator
