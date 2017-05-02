'use strict'

const apiCompatibilityChecks = require('opentracing/lib/test/api_compatibility').default
const DatadogTracer = require('../src')

apiCompatibilityChecks(() => new DatadogTracer({ service: 'test' }))
