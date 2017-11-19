'use strict'

const express = require('express')
const Tracer = require('../..')

const app = express()
const tracer = new Tracer({ service: 'example' })

tracer.on('error', e => console.log(e))

app.use((req, res, next) => {
  const span = tracer.startSpan('express.request')

  res.on('finish', () => trace(req, res, span))
  res.on('close', () => trace(req, res, span))

  next()
})

app.get('/hello/:name', (req, res) => {
  res.send(`Hello, ${req.params.name}!`)
})

app.listen(3000)

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
