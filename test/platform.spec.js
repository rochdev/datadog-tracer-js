'use strict'

const proxyquire = require('proxyquire')

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
})
