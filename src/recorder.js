'use strict'

const request = require('superagent')
const bignumJSON = require('json-bignum')

class DatadogRecorder {
  record (span) {
    const tracer = span.tracer()
    const spanContext = span.context()

    const body = bignumJSON.stringify([[{
      trace_id: new bignumJSON.BigNumber(spanContext.traceId.toString()),
      span_id: new bignumJSON.BigNumber(spanContext.spanId.toString()),
      parent_id: span._parentId ? new bignumJSON.BigNumber(span._parentId.toString()) : null,
      name: span._operationName,
      resource: span._tags.resource,
      service: tracer._service,
      type: span._tags.type,
      error: +!!span._tags.error,
      meta: span._tags,
      start: Math.round(span._startTime * 1e6),
      duration: Math.round(span._duration * 1e6)
    }]])

    return request
      .put(`${tracer._endpoint}/v0.3/traces`)
      .set('Content-Type', 'application/json')
      .send(body)
  }
}

module.exports = DatadogRecorder
