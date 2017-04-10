'use strict'

const proxyquire = require('proxyquire')

describe('Span', () => {
  let Span
  let span
  let tracer
  let Recorder
  let recorder
  let uuid

  beforeEach(() => {
    uuid = { v4: sinon.stub().returns('guid') }
    tracer = {}
    recorder = { record: sinon.spy() }
    Recorder = sinon.stub().returns(recorder)

    Span = proxyquire('../src/span', {
      'uuid': uuid,
      './tracer': tracer,
      './recorder': Recorder
    })
  })

  it('have a default context', () => {
    span = new Span(tracer, { operationName: 'operation' })

    expect(span.context()).to.deep.equal({
      traceId: 'guid',
      spanId: 'guid',
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

  it('use a parent context', () => {
    const parent = {
      traceId: '123',
      sampled: false,
      baggage: { foo: 'bar' }
    }

    span = new Span(tracer, { operationName: 'operation', parent })

    expect(span.context()).to.deep.equal({
      traceId: '123',
      spanId: 'guid',
      sampled: false,
      baggage: { foo: 'bar' }
    })
  })
})
