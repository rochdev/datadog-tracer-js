'use strict'

module.exports = bundle

const fs = require('fs')

const browserify = require('browserify')

const gulpif = require('gulp-if')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const gutil = require('gulp-util')

const buffer = require('vinyl-buffer')
const vinylfs = require('vinyl-fs')
const source = require('vinyl-source-stream')

const zopfli = require('node-zopfli')

/**
 * Bundles the library.
 * @param {Object} options Bundler options
 * @param {string} options.entry Entry file
 * @param {string} options.target Target directory
 * @param {boolean} [options.compress=false] Whether to minify or not
 * @returns {undefined}
 */
function bundle (options) {
  if (!options || !options.entry || !options.target) { throw TypeError('missing options') }

  const bundler = browserify({
    entries: options.entry,
    debug: true,
    standalone: 'DatadogTracer'
  })
    .transform('browserify-shim')
    .transform('babelify')

  return bundler
    .plugin(require('bundle-collapser/plugin'))
    .bundle()
    .pipe(source(options.compress ? 'datadog-tracer.min.js' : 'datadog-tracer.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(
      gulpif(options.compress, uglify())
    )
    .pipe(sourcemaps.write('.', { sourceRoot: '' }))
    .pipe(vinylfs.dest(options.target))
    .on('log', gutil.log)
    .on('error', gutil.log)
}

/**
 * Compresses a file using zopfli gzip.
 * @param {string} sourceFile Source file
 * @param {string} destinationFile Destination file
 * @param {function(?Error)} callback Node-style callback
 * @returns {undefined}
 */
bundle.compress = function compress (sourceFile, destinationFile, callback) {
  const src = fs.createReadStream(sourceFile)
  const dst = fs.createWriteStream(destinationFile)
  src.on('error', callback)
  dst.on('error', callback)
  dst.on('close', function () {
    callback(null)
  })
  src.pipe(zopfli.createGzip()).pipe(dst)
}
