'use strict'

const proxyquire = require('proxyquire')
const nock = require('nock')

describe('Platform', () => {
  let platform
  let now

  beforeEach(() => {
    sinon.stub(Date, 'now').returns(1000000000)
    sinon.stub(Math, 'random')
    now = sinon.stub().returns(100.11111)
    platform = proxyquire('../src/platform', { 'performance-now': now })
  })

  afterEach(() => {
    Date.now.restore()
    Math.random.restore()
  })

  it('should return the current time in milliseconds with high resolution', () => {
    now.returns(600.33333)

    expect(platform.now()).to.equal(1000000500.22222)
  })

  it('should return a random 64bit ID', () => {
    Math.random.onCall(0).returns(0)
    Math.random.onCall(1).returns(1)
    Math.random.onCall(2).returns(0)
    Math.random.onCall(3).returns(0)

    expect(platform.id().toString()).to.equal(String(255 << 8))
  })

  it('should send an http request', () => {
    nock('http://test:123', {
      reqheaders: {
        'content-type': 'application/json',
        'content-length': '13'
      }
    })
      .put('/path', { foo: 'bar' })
      .reply(200)

    return platform.request({
      protocol: 'http:',
      hostname: 'test',
      port: 123,
      path: '/path',
      method: 'PUT',
      data: JSON.stringify({ foo: 'bar' })
    })
  })

  it('should handle an http error response', () => {
    nock('http://localhost:80')
      .put('/path')
      .reply(400)

    return platform.request({
      path: '/path',
      method: 'PUT'
    })
      .then(() => setImmediate(() => { throw new Error() }))
      .catch(e => {
        expect(e).to.be.instanceof(Error)
      })
  })

  it('should handle an http network error', () => {
    return platform.request({
      path: '/path',
      method: 'PUT'
    })
      .then(() => setImmediate(() => { throw new Error() }))
      .catch(e => {
        expect(e).to.be.instanceof(Error)
      })
  })
})
