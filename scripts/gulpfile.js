const gulp = require('gulp')
const bundle = require('./bundle')

const defaultTask = []

function defineTask (entry, target) {
  gulp.task('bundle', bundle.bind(this, {
    entry: entry,
    target: target
  }))

  gulp.task('minify', [ 'bundle' ], bundle.bind(this, {
    entry: entry,
    target: target,
    compress: true
  }))

  gulp.task('compress', [ 'minify' ], function (callback) {
    bundle.compress(
      target + '/datadog-tracer.min.js',
      target + '/datadog-tracer.min.js.gz',
      callback
    )
  })
  defaultTask.push('bundle', 'minify', 'compress')
}

defineTask('../browser', '../dist')

gulp.task('default', defaultTask)
