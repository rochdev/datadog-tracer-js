'use strict'

const uuid = require('uuid')
const Long = require('long')
const Buffer = require('safe-buffer').Buffer
const opentracing = require('opentracing')
const Span = opentracing.Span
const Recorder = require('./recorder')
const Sampler = require('./sampler')
const SpanContext = require('./span_context')
const platform = require('./platform')

class DatadogSpan extends Span {
  constructor (tracer, fields) {
    super()

    const startTime = fields.startTime || platform.now()
    const operationName = fields.operationName
    const parent = fields.parent || null
    const tags = fields.tags || {}

    this._parentTracer = tracer
    this._sampler = new Sampler()
    this._recorder = new Recorder()
    this._operationName = operationName
    this._tags = Object.assign({}, tags)
    this._startTime = startTime

    if (parent) {
      this._spanContext = new SpanContext({
        traceId: parent.traceId,
        spanId: generateUUID(),
        sampled: parent.sampled,
        baggageItems: Object.assign({}, parent.baggageItems)
      })

      this._parentId = parent.spanId
    } else {
      this._spanContext = new SpanContext({
        traceId: generateUUID(),
        spanId: generateUUID(),
        sampled: this._sampler.isSampled(this),
        baggageItems: {}
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
    this._spanContext.baggageItems[key] = value
  }

  _getBaggageItem (key) {
    return this._spanContext.baggageItems[key]
  }

  _addTags (keyValuePairs) {
    Object.keys(keyValuePairs).forEach(key => {
      this._tags[key] = keyValuePairs[key]
    })
  }

  _finish (finishTime) {
    finishTime = finishTime || platform.now()

    this._duration = finishTime - this._startTime
    this._recorder.record(this)
      .catch(e => {
        this._parentTracer.emit('error', e)
      })
  }
}

function generateUUID () {
  const buffer = Buffer.alloc(8)
  uuid.v4(null, buffer)
  return new Long(buffer.readUInt32LE(), buffer.readUInt32LE(4), true)
}

module.exports = DatadogSpan
