'use strict'

const proxyquire = require('proxyquire')
const nock = require('nock')
const Buffer = require('safe-buffer').Buffer

describe('Platform', () => {
  let platform
  let now
  let crypto

  beforeEach(() => {
    sinon.stub(Date, 'now').returns(1000000000)
    crypto = { randomBytes: sinon.stub() }
    now = sinon.stub().returns(100.11111)
    platform = proxyquire('../src/platform', {
      'performance-now': now,
      'crypto': crypto
    })
  })

  afterEach(() => {
    Date.now.restore()
  })

  it('should return the current time in milliseconds with high resolution', () => {
    now.returns(600.33333)

    expect(platform.now()).to.equal(1000000500.22222)
  })

  it('should return a random 64bit ID', () => {
    const buffer = Buffer.alloc(8)
    buffer.writeUInt16LE(65280)

    crypto.randomBytes.returns(buffer)

    expect(platform.id().toString()).to.equal('65280')
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
