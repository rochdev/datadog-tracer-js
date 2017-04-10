'use strict'

const uuid = require('uuid')
const opentracing = require('opentracing')
const Span = opentracing.Span
const Recorder = require('./recorder')
const Sampler = require('./sampler')
const SpanContext = require('./span_context')

class DatadogSpan extends Span {
  constructor (tracer, fields) {
    super()

    const operationName = fields.operationName
    const parent = fields.parent || null
    const tags = fields.tags || {}
    const startTime = fields.startTime || Date.now()

    this._parentTracer = tracer
    this._sampler = new Sampler()
    this._recorder = new Recorder()
    this._operationName = operationName
    this._tags = Object.assign({}, tags)
    this._startTime = startTime

    if (parent) {
      this._spanContext = new SpanContext({
        traceId: parent.traceId,
        spanId: uuid.v4(),
        sampled: parent.sampled,
        baggage: Object.assign({}, parent.baggage)
      })

      this._parentId = parent.spanId
    } else {
      this._spanContext = new SpanContext({
        traceId: uuid.v4(),
        spanId: uuid.v4(),
        sampled: this._sampler.isSampled(this),
        baggage: {}
      })

      this._parentId = null
    }
  }

  _context () {
    return this._spanContext
  }

  _tracer () {
    return this._parentTracer
  }

  _setOperationName (name) {
    this._operationName = name
  }

  _setBaggageItem (key, value) {
    this._spanContext.baggage[key] = value
  }

  _getBaggageItem (key) {
    return this._spanContext.baggage[key]
  }

  _addTags (keyValuePairs) {
    Object.keys(keyValuePairs).forEach(key => {
      this._tags[key] = keyValuePairs[key]
    })
  }

  _finish (finishTime) {
    finishTime = finishTime || Date.now()

    this._duration = finishTime - this._startTime
    this._recorder.record(this)
  }
}

module.exports = DatadogSpan
