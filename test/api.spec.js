'use strict'

// TODO: add mockery to prevent real recording to Datadog

const apiCompatibilityChecks = require('opentracing/test/api_compatibility')
const DatadogTracer = require('../src/tracer')

apiCompatibilityChecks(() => new DatadogTracer({ service: 'test' }))
