'use strict'

const request = require('superagent')

class DatadogRecorder {
  record (span) {
    const tracer = span.tracer()
    const spanContext = span.context()

    // TODO: find a better way to handle int64
    const body = JSON.stringify([[{
      trace_id: spanContext.traceId.toString(),
      span_id: spanContext.spanId.toString(),
      parent_id: span._parentId ? span._parentId.toString() : null,
      name: span._operationName,
      resource: span._tags.resource,
      service: tracer._service,
      type: span._tags.type,
      error: span._tags.error ? 1 : 0,
      meta: span._tags,
      start: Math.round(span._startTime * 1e6),
      duration: Math.round(span._duration * 1e6)
    }]]).replace(/"(trace_id|span_id|parent_id)":"(\d+)"/g, '"$1":$2')

    // TODO: handle request errors
    return request
      .put(`${tracer._endpoint}/v0.3/traces`)
      .set('Content-Type', 'application/json')
      .send(body).catch()
  }
}

module.exports = DatadogRecorder
