'use strict'

const proxyquire = require('proxyquire')
const Long = require('long')
const TracerState = require('../../src/propagation/state.proto.js').TracerState

describe('Binary Propagator', () => {
  let BinaryPropagator

  describe('when Protobuf is available', () => {
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
          foo: 'bar',
          baz: 'qux'
        }
      }

      const propagator = new BinaryPropagator()
      propagator.inject(spanContext, carrier)

      const state = TracerState.toObject(TracerState.decode(carrier.buffer))

      expect(state).to.deep.equal(Object.assign({}, spanContext, {
        baggageItems: {
          foo: '"bar"',
          baz: '"qux"'
        }
      }))
    })

    it('should extract a span context from the carrier', () => {
      const spanContext = {
        traceId: new Long(123, 0, true),
        spanId: new Long(456, 0, true),
        sampled: true,
        baggageItems: {
          foo: 'bar',
          baz: 'qux'
        }
      }
      const state = TracerState.create(Object.assign({}, spanContext, {
        baggageItems: {
          foo: '"bar"',
          baz: '"qux"'
        }
      }))
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

  describe('when Protobuf is not available', () => {
    beforeEach(() => {
      BinaryPropagator = proxyquire('../../src/propagation/binary', {
        'protobufjs/minimal': false
      })
    })

    it('should throw when trying to inject without Protobuf support', () => {
      const carrier = {}
      const spanContext = {
        traceId: new Long(123, 0, true),
        spanId: new Long(456, 0, true),
        sampled: true,
        baggageItems: {
          foo: 'bar',
          baz: 'qux'
        }
      }

      const propagator = new BinaryPropagator()

      expect(() => {
        propagator.inject(spanContext, carrier)
      }).to.throw()
    })

    it('should throw when trying to extract without Protobuf support', () => {
      const spanContext = {
        traceId: new Long(123, 0, true),
        spanId: new Long(456, 0, true),
        sampled: true,
        baggageItems: {
          foo: 'bar',
          baz: 'qux'
        }
      }
      const state = TracerState.create(Object.assign({}, spanContext, {
        baggageItems: {
          foo: '"bar"',
          baz: '"qux"'
        }
      }))
      const carrier = {
        buffer: TracerState.encode(state).finish()
      }

      const propagator = new BinaryPropagator()

      expect(() => {
        propagator.extract(carrier)
      }).to.throw()
    })
  })
})
