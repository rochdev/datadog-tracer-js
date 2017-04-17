'use strict'

describe('Span Context', () => {
  let SpanContext

  beforeEach(() => {
    SpanContext = require('../src/span_context')
  })

  it('should instantiate with the given properties', () => {
    const props = {
      traceId: '123',
      spanId: '456',
      sampled: true,
      baggage: { foo: 'bar' }
    }
    const spanContext = new SpanContext(props)

    expect(spanContext).to.deep.equal(props)
  })

  it('should have the correct defaults', () => {
    const defaults = {
      traceId: '123',
      spanId: '456',
      sampled: true,
      baggage: {}
    }
    const spanContext = new SpanContext({
      traceId: defaults.traceId,
      spanId: defaults.spanId,
      sampled: defaults.sampled
    })

    expect(spanContext).to.deep.equal(defaults)
  })
})
