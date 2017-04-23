'use strict'

const bignumJSON = require('json-bignum')
const platform = require('./platform')

class DatadogRecorder {
  record (span) {
    const tracer = span.tracer()
    const spanContext = span.context()

    const data = bignumJSON.stringify([[{
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

module.exports = DatadogRecorder
