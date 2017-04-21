'use strict'

const apiCompatibilityChecks = require('opentracing/test/api_compatibility')
const DatadogTracer = require('../src/tracer')

apiCompatibilityChecks(() => new DatadogTracer({ service: 'test' }))
