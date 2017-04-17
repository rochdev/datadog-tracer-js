'use strict'

const nock = require('nock')

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
      traceId: '123',
      spanId: '456'
    }

    span = {
      _parentId: '789',
      _operationName: 'operation',
      _startTime: 1234567890000000000,
      _duration: 123456789,
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

    nock('http://localhost:8080')
      .put('/v0.3/traces', [[{
        trace_id: '123',
        span_id: '456',
        parent_id: '789',
        name: 'operation',
        resource: '/path',
        service: 'service',
        type: 'web',
        error: false,
        meta: {
          resource: '/path',
          type: 'web'
        },
        start: 1234567890000000000,
        duration: 123456789
      }]])
      .reply(200, expected)

    return recorder.record(span).then(response => {
      expect(response.status).to.equal(200)
      expect(response.text).to.equal(expected)
    })
  })
})
