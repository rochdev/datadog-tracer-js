'use strict'

describe('Endpoint', () => {
  let Endpoint

  beforeEach(() => {
    Endpoint = require('../src/endpoint')
  })

  it('should parse a URL', () => {
    const endpoint = new Endpoint('https://test:123')

    expect(endpoint).to.have.property('protocol', 'https:')
    expect(endpoint).to.have.property('hostname', 'test')
    expect(endpoint).to.have.property('port', 123)
  })
})
