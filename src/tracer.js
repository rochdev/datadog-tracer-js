'use strict'

const opentracing = require('opentracing')
const Tracer = opentracing.Tracer
const EventEmitter = require('@protobufjs/eventemitter')
const Span = require('./span')
const TextMapPropagator = require('./propagation/text_map')
const BinaryPropagator = require('./propagation/binary')
const Endpoint = require('./endpoint')

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
    this._endpoint = new Endpoint(endpoint || `${protocol}://${hostname}:${port}`)
    this._propagators = {
      [opentracing.FORMAT_TEXT_MAP]: new TextMapPropagator(),
      [opentracing.FORMAT_HTTP_HEADERS]: new TextMapPropagator(),
      [opentracing.FORMAT_BINARY]: new BinaryPropagator()
    }
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
    this._propagators[format].inject(spanContext, carrier)
    return this
  }

  _extract (format, carrier) {
    return this._propagators[format].extract(carrier)
  }
}

Object.assign(DatadogTracer.prototype, EventEmitter.prototype)

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

module.exports = DatadogTracer
