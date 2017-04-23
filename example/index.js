var express = require('express')
var Tracer = require('../src')

var app = express()
var tracer = new Tracer({ service: 'example' })

tracer.on('error', function (e) {
  console.log(e)
})

app.get('/hello/:name', function (req, res) {
  var span = tracer.startSpan('say_hello')

  res.status(200)

  span.addTags({
    'resource': req.route.path,
    'type': 'web',
    'span.kind': 'server',
    'http.method': req.method,
    'http.url': req.url,
    'http.status_code': res.statusCode
  })

  span.finish()

  res.send('Hello, ' + req.params.name + '!')
})

app.listen(3000)
