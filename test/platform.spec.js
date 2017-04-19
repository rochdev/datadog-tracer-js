'use strict'

const proxyquire = require('proxyquire')

describe('Platform', () => {
  let platform
  let now

  beforeEach(() => {
    sinon.stub(Date, 'now').returns(1000000000)
    now = sinon.stub().returns(100.11111)
    platform = proxyquire('../src/platform', { 'performance-now': now })
  })

  afterEach(() => {
    Date.now.restore()
  })

  it('should return the current time in milliseconds with high resolution', () => {
    now.returns(600.33333)

    expect(platform.now()).to.equal(1000000500.22222)
  })
})
