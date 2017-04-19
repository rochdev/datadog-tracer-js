'use strict'

const Long = require('long')

describe('HTTP Headers Propagator', () => {
  let HttpHeadersPropagator

  beforeEach(() => {
    HttpHeadersPropagator = require('../../src/propagation/http_headers')
  })

  it('should inject the span context into the carrier', () => {
    const carrier = {}
    const spanContext = {
      traceId: new Long(0, 0, true),
      spanId: new Long(0, 0, true),
      sampled: true,
      baggage: {
        foo: 'bar'
      }
    }

    const propagator = new HttpHeadersPropagator()
    propagator.inject(spanContext, carrier)

    expect(carrier).to.deep.equal({
      'dd-tracer-traceid': '0',
      'dd-tracer-spanid': '0',
      'dd-tracer-sampled': 'true',
      'dd-baggage-foo': 'bar'
    })
  })

  it('should extract a span context from the carrier', () => {
    const carrier = {
      'dd-tracer-traceid': '0',
      'dd-tracer-spanid': '0',
      'dd-tracer-sampled': 'true',
      'dd-baggage-foo': 'bar'
    }

    const propagator = new HttpHeadersPropagator()
    const spanContext = propagator.extract(carrier)

    expect(spanContext).to.deep.equal({
      traceId: new Long(0, 0, true),
      spanId: new Long(0, 0, true),
      sampled: true,
      baggage: {
        foo: 'bar'
      }
    })
  })
})
