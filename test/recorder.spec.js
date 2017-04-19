'use strict'

const nock = require('nock')
const Long = require('long')

describe('Recorder', () => {
  let Recorder
  let recorder
  let tracer
  let span
  let spanContext

  beforeEach(() => {
    Recorder = require('../src/recorder')

    tracer = {
      _service: 'service',
      _endpoint: 'http://localhost:8080'
    }

    spanContext = {
      traceId: new Long(0, 0, true),
      spanId: new Long(0, 0, true)
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

    recorder = new Recorder()
  })

  it('should send a request to the Datadog agent', () => {
    const expected = 'response'

    nock('http://localhost:8080', {
      reqheaders: {
        'Content-Type': 'application/json'
      }
    })
      .put('/v0.3/traces', JSON.stringify([[{
        trace_id: 0,
        span_id: 0,
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
      }]]))
      .reply(200, expected)

    return recorder.record(span).then(response => {
      expect(response.status).to.equal(200)
      expect(response.text).to.equal(expected)
    })
  })
})
