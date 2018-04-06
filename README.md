# Datadog Tracer

[![npm](https://img.shields.io/npm/v/datadog-tracer.svg)](https://www.npmjs.com/package/datadog-tracer)
[![Build Status](https://travis-ci.org/rochdev/datadog-tracer-js.svg?branch=master)](https://travis-ci.org/rochdev/datadog-tracer-js)
[![codecov](https://codecov.io/gh/rochdev/datadog-tracer-js/branch/master/graph/badge.svg)](https://codecov.io/gh/rochdev/datadog-tracer-js)
[![Code Climate](https://codeclimate.com/github/rochdev/datadog-tracer-js/badges/gpa.svg)](https://codeclimate.com/github/rochdev/datadog-tracer-js)
[![Greenkeeper badge](https://badges.greenkeeper.io/rochdev/datadog-tracer-js.svg)](https://greenkeeper.io/)
[![bitHound Dependencies](https://www.bithound.io/github/rochdev/datadog-tracer-js/badges/dependencies.svg)](https://www.bithound.io/github/rochdev/datadog-tracer-js/master/dependencies/npm)

## DEPRECATED: The official library [dd-trace-js](https://github.com/DataDog/dd-trace-js) has now been released.

OpenTracing tracer implementation for Datadog in JavaScript.
It is intended for use both on the server and in the browser.

## Installation

### NodeJS

```sh
npm install --save datadog-tracer
```

*Node >= 4 is required.*

### Browser

The library supports CommonJS and AMD loaders and also exports globally as `DatadogTracer`.

**NOTE:** If you want to use binary propagation, make sure to also include the minimal version of [protobuf.js](https://github.com/dcodeIO/protobuf.js/tree/master/dist/minimal) before this library.

#### CDN

```html
<script src="//cdn.rawgit.com/rochdev/datadog-tracer-js/0.X.X/dist/datadog-tracer.min.js"></script>
```

**NOTE:** Remember to replace the version tag with the exact [release](https://github.com/rochdev/datadog-tracer-js/tags) your project depends upon.

#### Frontend

```html
<script src="node_modules/datadog-tracer/dist/datadog-tracer.min.js"></script>
```

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
const express = require('express')
const Tracer = require('datadog-tracer')

const app = express()
const tracer = new Tracer({ service: 'example' })

// handle errors from Datadog agent. omit this if you want to ignore errors
tracer.on('error', e => console.log(e))

app.get('/hello/:name', (req, res) => {
  const span = tracer.startSpan('say_hello')

  span.addTags({
    'resource': '/hello/:name', // required by Datadog
    'type': 'web', // required by Datadog
    'span.kind': 'server',
    'http.method': 'GET',
    'http.url': req.url,
    'http.status_code': '200'
  })

  span.finish()

  res.send(`Hello, ${req.params.name}!`)
})

app.listen(3000)
```

See the [examples](examples) folder for more advanced examples.

## API Documentation

See the OpenTracing JavaScript [API](https://doc.esdoc.org/github.com/opentracing/opentracing-javascript/)

## Additional Resources

* [OpenTracing Specification](https://github.com/opentracing/specification/blob/master/specification.md)
* [OpenTracing Semantic Conventions](https://github.com/opentracing/specification/blob/master/semantic_conventions.md)
