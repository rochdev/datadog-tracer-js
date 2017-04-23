'use strict'

const opentracing = require('opentracing')
const Tracer = opentracing.Tracer
const EventEmitter = require('@protobufjs/eventemitter')
const Span = require('./span')
const TextMapPropagator = require('./propagation/text_map')
const BinaryPropagator = require('./propagation/binary')

class DatadogTracer extends Tracer {
  constructor (config) {
    super()
    EventEmitter.call(this)

    const service = config.service
    const endpoint = config.endpoint
    const hostname = config.hostname || 'localhost'
    const port = config.port || 8126
    const protocol = config.protocol || 'http'

    this._service = service
    this._endpoint = endpoint || `${protocol}://${hostname}:${port}`
  }

  _startSpan (name, fields) {
    return new Span(this, {
      operationName: fields.operationName || name,
      parent: getParent(fields.references),
      tags: fields.tags,
      startTime: fields.startTime
    })
  }

  _inject (spanContext, format, carrier) {
    getPropagator(format).inject(spanContext, carrier)
    return this
  }

  _extract (format, carrier) {
    return getPropagator(format).extract(carrier)
  }
}

function getPropagator (format) {
  let propagator

  switch (format) {
    case opentracing.FORMAT_HTTP_HEADERS:
    case opentracing.FORMAT_TEXT_MAP:
      propagator = new TextMapPropagator()
      break
    case opentracing.FORMAT_BINARY:
      propagator = new BinaryPropagator()
      break
  }

  return propagator
}

function getParent (references) {
  let parent = null

  if (references) {
    for (let i = 0; i < references.length; i++) {
      const ref = references[i]
      if (ref.type() === opentracing.REFERENCE_CHILD_OF) {
        parent = ref.referencedContext()
        break
      } else if (ref.type() === opentracing.REFERENCE_FOLLOWS_FROM) {
        if (!parent) {
          parent = ref.referencedContext()
        }
      }
    }
  }

  return parent
}

Object.assign(DatadogTracer.prototype, EventEmitter.prototype)

module.exports = DatadogTracer
