'use strict'

const platform = require('./platform')
const Long = require('long')

class DatadogRecorder {
  record (span) {
    const tracer = span.tracer()
    const spanContext = span.context()

    const data = stringify([[{
      trace_id: spanContext.traceId,
      span_id: spanContext.spanId,
      parent_id: span._parentId || null,
      name: span._operationName,
      resource: span._tags.resource,
      service: tracer._service,
      type: span._tags.type,
      error: +!!span._tags.error,
      meta: span._tags,
      start: Math.round(span._startTime * 1e6),
      duration: Math.max(Math.round(span._duration * 1e6), 1)
    }]])

    return platform.request({
      protocol: tracer._endpoint.protocol,
      hostname: tracer._endpoint.hostname,
      port: tracer._endpoint.port,
      path: '/v0.3/traces',
      method: 'PUT',
      data
    })
  }
}

function stringify (obj) {
  switch (typeof obj) {
    case 'object':
      if (Long.isLong(obj)) {
        return obj.toString()
      } else if (Array.isArray(obj)) {
        return '[' + obj.map(item => stringify(item)).join(',') + ']'
      } else if (obj !== null) {
        return '{' + Object.keys(obj)
          .map(key => `"${key}":` + stringify(obj[key]))
          .join(',') + '}'
      }

      return 'null'
    case 'string':
      return `"${obj}"`
    case 'number':
    case 'boolean':
      return String(obj)
  }
}

module.exports = DatadogRecorder
