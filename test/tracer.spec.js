'use strict'

const proxyquire = require('proxyquire')
const opentracing = require('opentracing')
const Reference = opentracing.Reference
const Endpoint = require('../src/endpoint')

describe('Tracer', () => {
  let Tracer
  let tracer
  let Span
  let span
  let spanContext
  let fields
  let carrier
  let TextMapPropagator
  let BinaryPropagator
  let propagator

  beforeEach(() => {
    fields = {}

    span = {}
    Span = sinon.stub().returns(span)

    spanContext = {}
    carrier = {}

    TextMapPropagator = sinon.stub()
    BinaryPropagator = sinon.stub()
    propagator = {
      inject: sinon.stub(),
      extract: sinon.stub()
    }

    Tracer = proxyquire('../src/tracer', {
      './span': Span,
      './propagation/text_map': TextMapPropagator,
      './propagation/binary': BinaryPropagator
    })

    tracer = new Tracer({ service: 'service' })
  })

  it('should support host configuration', () => {
    tracer = new Tracer({
      service: 'service',
      hostname: 'test',
      port: 7777,
      protocol: 'https'
    })

    expect(tracer._endpoint).to.deep.equal(new Endpoint('https://test:7777'))
  })

  it('should support endpoint configuration', () => {
    const endpoint = 'http://test:123'

    tracer = new Tracer({ service: 'service', endpoint })

    expect(tracer._endpoint).to.deep.equal(new Endpoint('http://test:123'))
  })

  it('should start a span', () => {
    fields.tags = { foo: 'bar' }
    fields.startTime = 1234567890000000000

    const testSpan = tracer.startSpan('name', fields)

    expect(Span).to.have.been.calledWith(tracer, {
      operationName: 'name',
      parent: null,
      tags: fields.tags,
      startTime: fields.startTime
    })

    expect(testSpan).to.equal(span)
  })

  it('should start a span that is the child of a span', () => {
    const parent = {}

    fields.references = [
      new Reference(opentracing.REFERENCE_CHILD_OF, parent)
    ]

    tracer.startSpan('name', fields)

    expect(Span).to.have.been.calledWithMatch(tracer, {
      operationName: 'name',
      parent
    })
  })

  it('should start a span that follows from a span', () => {
    const parent = {}

    fields.references = [
      new Reference(opentracing.REFERENCE_FOLLOWS_FROM, parent)
    ]

    tracer.startSpan('name', fields)

    expect(Span).to.have.been.calledWithMatch(tracer, {
      operationName: 'name',
      parent
    })
  })

  it('should ignore additional follow references', () => {
    const parent = {}

    fields.references = [
      new Reference(opentracing.REFERENCE_FOLLOWS_FROM, parent),
      new Reference(opentracing.REFERENCE_FOLLOWS_FROM, {})
    ]

    tracer.startSpan('name', fields)

    expect(Span).to.have.been.calledWithMatch(tracer, {
      operationName: 'name',
      parent
    })
  })

  it('should ignore unknown references', () => {
    fields.references = [
      new Reference('test', {})
    ]

    tracer.startSpan('name', fields)

    expect(Span).to.have.been.calledWithMatch(tracer, {
      operationName: 'name',
      parent: null
    })
  })

  it('should support error event', done => {
    const error = new Error()

    tracer.on('error', e => {
      expect(e).to.equal(error)
      done()
    })

    tracer.emit('error', error)
  })

  it('should support inject of text map format', () => {
    TextMapPropagator.returns(propagator)

    tracer.inject(spanContext, opentracing.FORMAT_TEXT_MAP, carrier)

    expect(propagator.inject).to.have.been.calledWith(spanContext, carrier)
  })

  it('should support inject of http headers format', () => {
    TextMapPropagator.returns(propagator)

    tracer.inject(spanContext, opentracing.FORMAT_HTTP_HEADERS, carrier)

    expect(propagator.inject).to.have.been.calledWith(spanContext, carrier)
  })

  it('should support inject of binary format', () => {
    BinaryPropagator.returns(propagator)

    tracer.inject(spanContext, opentracing.FORMAT_BINARY, carrier)

    expect(propagator.inject).to.have.been.calledWith(spanContext, carrier)
  })

  it('should support extract of text map format', () => {
    TextMapPropagator.returns(propagator)
    propagator.extract.withArgs(carrier).returns('spanContext')

    const spanContext = tracer.extract(opentracing.FORMAT_TEXT_MAP, carrier)

    expect(spanContext).to.equal('spanContext')
  })

  it('should support extract of http headers format', () => {
    TextMapPropagator.returns(propagator)
    propagator.extract.withArgs(carrier).returns('spanContext')

    const spanContext = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, carrier)

    expect(spanContext).to.equal('spanContext')
  })

  it('should support extract of binary format', () => {
    BinaryPropagator.returns(propagator)
    propagator.extract.withArgs(carrier).returns('spanContext')

    const spanContext = tracer.extract(opentracing.FORMAT_BINARY, carrier)

    expect(spanContext).to.equal('spanContext')
  })
})
