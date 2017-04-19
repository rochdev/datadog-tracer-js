'use strict'

const path = require('path')
const protobuf = require('protobufjs')
const SpanContext = require('../span_context')

const builder = protobuf.loadSync(path.join(__dirname, 'state.proto'))
const TracerState = builder.lookupType('TracerState')

class BinaryPropagator {
  inject (spanContext, carrier) {
    const payload = {
      traceId: spanContext.traceId,
      spanId: spanContext.spanId,
      sampled: spanContext.sampled,
      baggage: spanContext.baggage
    }

    const err = TracerState.verify(payload)
    if (err) throw err

    const state = TracerState.create(payload)

    carrier.buffer = TracerState.encode(state).finish()
  }

  extract (carrier) {
    let state

    try {
      const message = TracerState.decode(carrier.buffer)
      state = TracerState.toObject(message)
      return new SpanContext(state)
    } catch (e) {
      return null
    }
  }
}

module.exports = BinaryPropagator
