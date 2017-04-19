'use strict'

const proxyquire = require('proxyquire')
const Long = require('long')

describe('Span', () => {
  let Span
  let span
  let tracer
  let Recorder
  let recorder
  let uuid

  beforeEach(() => {
    uuid = { v4: sinon.stub() }
    tracer = {}
    recorder = { record: sinon.spy() }
    Recorder = sinon.stub().returns(recorder)

    Span = proxyquire('../src/span', {
      'uuid': uuid,
      './tracer': tracer,
      './recorder': Recorder
    })
  })

  it('should have a default context', () => {
    span = new Span(tracer, { operationName: 'operation' })

    expect(span.context()).to.deep.equal({
      traceId: new Long(0, 0, true),
      spanId: new Long(0, 0, true),
      sampled: true,
      baggage: {}
    })
  })

  it('should store its tracer', () => {
    span = new Span(tracer, { operationName: 'operation' })

    expect(span.tracer()).to.equal(tracer)
  })

  it('should set baggage items', () => {
    span = new Span(tracer, { operationName: 'operation' })
    span.setBaggageItem('foo', 'bar')

    expect(span.context().baggage).to.have.property('foo', 'bar')
  })

  it('should set a tag', () => {
    span = new Span(tracer, { operationName: 'operation' })
    span.setTag('foo', 'bar')

    expect(span._tags).to.have.property('foo', 'bar')
  })

  it('should add tags', () => {
    span = new Span(tracer, { operationName: 'operation' })
    span.addTags({ foo: 'bar' })

    expect(span._tags).to.have.property('foo', 'bar')
  })

  it('should record on finish', () => {
    span = new Span(tracer, { operationName: 'operation' })
    span.finish()

    expect(recorder.record).to.have.been.calledWith(span)
  })

  it('should use a parent context', () => {
    const parent = {
      traceId: '123',
      sampled: false,
      baggage: { foo: 'bar' }
    }

    span = new Span(tracer, { operationName: 'operation', parent })

    expect(span.context()).to.deep.equal({
      traceId: '123',
      spanId: new Long(0, 0, true),
      sampled: false,
      baggage: { foo: 'bar' }
    })
  })
})
