# Datadog Tracer

[![npm](https://img.shields.io/npm/v/datadog-tracer.svg)](https://www.npmjs.com/package/datadog-tracer)
[![Build Status](https://travis-ci.org/rochdev/datadog-tracer-js.svg?branch=master)](https://travis-ci.org/rochdev/datadog-tracer-js)
[![codecov](https://codecov.io/gh/rochdev/datadog-tracer-js/branch/master/graph/badge.svg)](https://codecov.io/gh/rochdev/datadog-tracer-js)
[![Code Climate](https://codeclimate.com/github/rochdev/datadog-tracer-js/badges/gpa.svg)](https://codeclimate.com/github/rochdev/datadog-tracer-js)
[![Greenkeeper badge](https://badges.greenkeeper.io/rochdev/datadog-tracer-js.svg)](https://greenkeeper.io/)
[![bitHound Dependencies](https://www.bithound.io/github/rochdev/datadog-tracer-js/badges/dependencies.svg)](https://www.bithound.io/github/rochdev/datadog-tracer-js/master/dependencies/npm)

OpenTracing tracer implementation for Datadog in JavaScript.
It is intended for use both on the server and (soon) in the browser.

## Installation

### NodeJS

```sh
npm install --save datadog-tracer
```

*Node >= 4 is required.*

### Browser

*Not yet supported*

## Usage

See the OpenTracing JavaScript [documentation](https://github.com/opentracing/opentracing-javascript) for more information.

### Custom tracer options

* **service**: name of the Datadog service
* **hostname**: hostname of the Datadog agent *(default: localhost)*
* **port**: port of the Datadog agent *(default: 8126)*
* **protocol**: protocol of the Datadog agent *(default: http)*
* **endpoint**: full URL of the Datadog agent *(alternative to hostname+port+protocol)*

### Example

```js
var express = require('express')
var Tracer = require('datadog-tracer')

var tracer = new Tracer({ service: 'my service' })

// handle errors from Datadog agent. omit this if you want to ignore errors
tracer.on('error', function (e) {
  console.log(e)
})

var app = express()

app.get('/user/:id', function (req, res) {
  var span = tracer.startSpan('someOperation')

  // do stuff

  span.addTags({
    'resource': '/user/:id', // required by Datadog
    'type': 'web', // required by Datadog
    'span.kind': 'server',
    'http.method': 'GET',
    'http.url': '/user/123',
    'http.status_code': '200'
  })
  span.finish()
  
  res.send()
})
```

See the [semantic conventions](https://github.com/opentracing/specification/blob/master/semantic_conventions.md) for
more information about tags.

## API Documentation

See the OpenTracing JavaScript [API](https://doc.esdoc.org/github.com/opentracing/opentracing-javascript/)
