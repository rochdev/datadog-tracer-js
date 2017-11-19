'use strict'

const platform = require('./src/platform')
const node = require('./src/platform/node')

platform.use(node)

module.exports = require('./src/tracer')
