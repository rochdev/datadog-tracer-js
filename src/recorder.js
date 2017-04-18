'use strict'

const request = require('superagent')

class DatadogRecorder {
  record (span) {
    const tracer = span.tracer()
    const spanContext = span.context()

    return request.put(`${tracer._endpoint}/v0.3/traces`, [[{
      trace_id: spanContext.traceId,
      span_id: spanContext.spanId,
      parent_id: span._parentId,
      name: span._operationName,
      resource: span._tags.resource,
      service: tracer._service,
      type: span._tags.type,
      error: !!span._tags.error,
      meta: span._tags,
      start: Math.round(span._startTime * 1e6),
      duration: Math.round(span._duration * 1e6)
    }]])
  }
}

module.exports = DatadogRecorder
