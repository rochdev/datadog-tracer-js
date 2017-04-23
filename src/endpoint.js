'use strict'

const urlExpression = /^((http:|https:)\/\/)?([^:/]+)(:(\d+))?/

class Endpoint {
  constructor (url) {
    const matches = url.match(urlExpression)

    this.protocol = matches[2]
    this.hostname = matches[3]
    this.port = Number(matches[5])
  }
}

module.exports = Endpoint
