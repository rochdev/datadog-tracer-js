'use strict'

const platform = require('./platform')
const node = require('./platform/node')

platform.use(node)

module.exports = require('./tracer')
