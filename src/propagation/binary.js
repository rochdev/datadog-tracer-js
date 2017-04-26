'use strict'

const protobuf = require('protobufjs/minimal')
const SpanContext = require('../span_context')
let TracerState

if (protobuf) {
  protobuf.util.Long = require('long')
  protobuf.configure()
  TracerState = require('./state.proto.js').TracerState
}

class BinaryPropagator {
  inject (spanContext, carrier) {
    assertProtobuf()

    const err = TracerState.verify(spanContext)
    if (err) throw err

    const message = TracerState.create(spanContext)

    copy(message.baggageItems, spanContext.baggageItems, JSON.stringify)

    carrier.buffer = TracerState.encode(message).finish()
  }

  extract (carrier) {
    assertProtobuf()

    let state

    try {
      const message = TracerState.decode(carrier.buffer)
      state = TracerState.toObject(message)

      copy(state.baggageItems, state.baggageItems, JSON.parse)

      return new SpanContext(state)
    } catch (e) {
      return null
    }
  }
}

function copy (dest, src, customizer) {
  Object.keys(src).forEach(key => {
    dest[key] = customizer(src[key])
  })
}

function assertProtobuf () {
  if (!protobuf) {
    throw new Error(
      'Binary propagation is not available in your environment because Protobuf could not be found. ' +
      'Please make sure to import Protobuf when using binary propagation.'
    )
  }
}

module.exports = BinaryPropagator
