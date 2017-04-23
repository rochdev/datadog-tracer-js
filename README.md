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

var app = express()
var tracer = new Tracer({ service: 'example' })

// handle errors from Datadog agent. omit this if you want to ignore errors
tracer.on('error', function (e) {
  console.log(e)
})

app.get('/hello/:name', function (req, res) {
  var span = tracer.startSpan('say_hello')

  res.status(200)

  span.addTags({
    'resource': req.route.path, // required by Datadog
    'type': 'web', // required by Datadog
    'span.kind': 'server',
    'http.method': req.method,
    'http.url': req.url,
    'http.status_code': res.statusCode
  })

  span.finish()

  res.send('Hello, ' + req.params.name + '!')
})

app.listen(3000)
```

See the [example](example) folder to run this example.

## API Documentation

See the OpenTracing JavaScript [API](https://doc.esdoc.org/github.com/opentracing/opentracing-javascript/)

## Additional Resources

* [OpenTracing Specification](https://github.com/opentracing/specification/blob/master/specification.md)
* [OpenTracing Semantic Conventions](https://github.com/opentracing/specification/blob/master/semantic_conventions.md)
