'use strict'

const SpanContext = require('opentracing').SpanContext

class DatadogSpanContext extends SpanContext {
  constructor (props) {
    super()

    this.traceId = props.traceId
    this.spanId = props.spanId
    this.sampled = props.sampled
    this.baggage = props.baggage || {}
  }
}

module.exports = DatadogSpanContext
