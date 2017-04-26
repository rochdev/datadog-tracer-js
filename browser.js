'use strict'

const platform = require('./src/platform')
const browser = require('./src/platform/browser')

platform.use(browser)

module.exports = require('./src/tracer')
