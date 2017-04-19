'use strict'

const path = require('path')
const protobuf = require('protobufjs')
const Long = require('long')

const builder = protobuf.loadSync(path.join(__dirname, '..', '..', 'src', 'propagation', 'state.proto'))
const TracerState = builder.lookupType('TracerState')

describe('Binary Propagator', () => {
  let BinaryPropagator

  beforeEach(() => {
    BinaryPropagator = require('../../src/propagation/binary')
  })

  it('should inject the span context into the carrier', () => {
    const carrier = {}
    const spanContext = {
      traceId: new Long(123, 0, true),
      spanId: new Long(456, 0, true),
      sampled: true,
      baggageItems: {
        foo: 'bar'
      }
    }

    const propagator = new BinaryPropagator()
    propagator.inject(spanContext, carrier)

    const state = TracerState.toObject(TracerState.decode(carrier.buffer))

    expect(state).to.deep.equal(spanContext)
  })

  it('should extract a span context from the carrier', () => {
    const spanContext = {
      traceId: new Long(123, 0, true),
      spanId: new Long(456, 0, true),
      sampled: true,
      baggageItems: {
        foo: 'bar'
      }
    }
    const state = TracerState.create(spanContext)
    const carrier = {
      buffer: TracerState.encode(state).finish()
    }
    const propagator = new BinaryPropagator()

    expect(propagator.extract(carrier)).to.deep.equal(spanContext)
  })

  it('should return null when the carrier does not contain a valid context', () => {
    const carrier = {
      buffer: null
    }

    const propagator = new BinaryPropagator()
    const spanContext = propagator.extract(carrier)

    expect(spanContext).to.be.null
  })

  it('should throw when trying to inject an invalid span context', () => {
    const carrier = {}
    const spanContext = {
      traceId: 0,
      spanId: 0,
      sampled: 123,
      baggageItems: 'foo'
    }

    const propagator = new BinaryPropagator()

    expect(() => {
      propagator.inject(spanContext, carrier)
    }).to.throw()
  })
})
