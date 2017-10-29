'use strict'

const cls = require('continuation-local-storage')
const tracer = require('./tracer')

function middleware () {
  return (req, res, next) => {
    const session = cls.getNamespace('example')
    const span = tracer.startSpan('express.request')

    res.on('finish', () => trace(req, res, span))
    res.on('close', () => trace(req, res, span))

    session.run(() => {
      session.set('root', span)
      next()
    })
  }
}

function trace (req, res, span) {
  span.addTags({
    'resource': req.route.path,
    'type': 'web',
    'span.kind': 'server',
    'http.method': req.method,
    'http.url': req.url,
    'http.status_code': res.statusCode
  })

  span.finish()
}

module.exports = middleware
