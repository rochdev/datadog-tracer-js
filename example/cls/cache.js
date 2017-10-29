'use strict'

const cls = require('continuation-local-storage')
const redis = require('redis-mock')
const tracer = require('./tracer')

const client = redis.createClient()

const cache = {
  get (key, callback) {
    const session = cls.getNamespace('example')

    session.run(() => {
      const span = tracer.startSpan('redis.get', {
        childOf: session.get('root')
      })

      client.get(key, (err, value) => {
        span.addTags({
          'resource': key,
          'type': 'cache',
          'span.kind': 'client'
        })

        span.finish()

        callback(null, value)
      })
    })
  },

  set (key, value, callback) {
    const session = cls.getNamespace('example')

    session.run(() => {
      const span = tracer.startSpan('redis.set', {
        childOf: session.get('root')
      })

      client.set(key, value, (err, stored) => {
        span.addTags({
          'resource': key,
          'type': 'cache',
          'span.kind': 'client'
        })

        span.finish()

        callback(null, stored)
      })
    })
  }
}

module.exports = cache
