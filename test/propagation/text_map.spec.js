'use strict'

describe('Text Map Propagator', () => {
  let TextMapPropagator

  beforeEach(() => {
    TextMapPropagator = require('../../src/propagation/text_map')
  })

  it('should inject the span context into the carrier', () => {
    const carrier = {}
    const spanContext = {
      traceId: '123',
      spanId: '456',
      sampled: true,
      baggage: {
        foo: 'bar'
      }
    }

    const propagator = new TextMapPropagator()
    propagator.inject(spanContext, carrier)

    expect(carrier).to.deep.equal({
      'dd-tracer-traceid': '123',
      'dd-tracer-spanid': '456',
      'dd-tracer-sampled': 'true',
      'dd-baggage-foo': 'bar'
    })
  })

  it('should extract a span context from the carrier', () => {
    const carrier = {
      'dd-tracer-traceid': '123',
      'dd-tracer-spanid': '456',
      'dd-tracer-sampled': 'true',
      'dd-baggage-foo': 'bar'
    }

    const propagator = new TextMapPropagator()
    const spanContext = propagator.extract(carrier)

    expect(spanContext).to.deep.equal({
      traceId: '123',
      spanId: '456',
      sampled: true,
      baggage: {
        foo: 'bar'
      }
    })
  })
})
