'use strict'

const cls = require('continuation-local-storage')
const express = require('express')
const bodyParser = require('body-parser')
const cache = require('./cache')
const tracer = require('./tracer')
const traceMiddleware = require('./trace-middleware')

cls.createNamespace('example')

const app = express()

app.use(traceMiddleware())
app.use(bodyParser.text())

app.get('/:key', (req, res) => {
  cache.get(req.params.key, (err, value) => res.send(value))
})

app.put('/:key', (req, res) => {
  cache.set(req.params.key, req.body, () => res.status(200).end())
})

app.listen(3000)
