'use strict'

const Tracer = require('../../src')

const tracer = new Tracer({ service: 'example' })

tracer.on('error', e => console.log(e))

module.exports = tracer
