'use strict'

if (Date.now) {
  module.exports = () => Date.now()
} else {
  module.exports = () => new Date().getTime()
}
