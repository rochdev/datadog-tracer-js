'use strict'

const Long = require('long')

describe('Recorder', () => {
  let Recorder
  let recorder
  let tracer
  let span
  let spanContext
  let request

  beforeEach(() => {
    Recorder = require('../src/recorder')

    tracer = {
      _service: 'service',
      _endpoint: 'http://localhost:8080'
    }

    spanContext = {
      traceId: new Long(123, 0, true),
      spanId: new Long(456, 0, true)
    }

    span = {
      _parentId: new Long(0, 0, true),
      _operationName: 'operation',
      _startTime: 1234567890000.123456789,
      _duration: 123.456789123,
      _tags: {
        resource: '/path',
        type: 'web'
      },
      context: sinon.stub().returns(spanContext),
      tracer: sinon.stub().returns(tracer)
    }

    request = [[{
      trace_id: 123,
      span_id: 456,
      parent_id: 0,
      name: 'operation',
      resource: '/path',
      service: 'service',
      type: 'web',
      error: 0,
      meta: {
        resource: '/path',
        type: 'web'
      },
      start: 1234567890000123600,
      duration: 123456789
    }]]

    recorder = new Recorder()
  })

  it('should send a request to the Datadog agent', () => {
    const expected = 'response'

    nock('http://localhost:8080', {
      reqheaders: {
        'Content-Type': 'application/json'
      }
    })
      .put('/v0.3/traces', request)
      .reply(200, expected)

    return recorder.record(span).then(response => {
      expect(response.status).to.equal(200)
      expect(response.text).to.equal(expected)
    })
  })

  it('should support long integers for IDs', () => {
    const expected = 'response'

    spanContext.traceId = Long.fromString('9223372036854775807', true)
    spanContext.spanId = Long.fromString('9223372036854775807', true)
    span._parentId = Long.fromString('9223372036854775807', true)

    request[0][0].trace_id = '9223372036854775807'
    request[0][0].span_id = '9223372036854775807'
    request[0][0].parent_id = '9223372036854775807'

    nock('http://localhost:8080', {
      reqheaders: {
        'Content-Type': 'application/json'
      }
    })
      .put('/v0.3/traces', JSON.stringify(request).replace(/"(trace_id|span_id|parent_id)":"(\d+)"/g, '"$1":$2'))
      .reply(200, expected)

    return recorder.record(span).then(response => {
      expect(response.status).to.equal(200)
      expect(response.text).to.equal(expected)
    })
  })
})
