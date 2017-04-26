'use strict'

if (global.crypto) {
  module.exports = global.crypto
} else if (global.msCrypto) {
  module.exports = global.msCrypto
} else {
  const MersenneTwister = require('mersenne-twister')
  const twister = new MersenneTwister(Math.random() * Number.MAX_SAFE_INTEGER)

  module.exports = {
    getRandomValues: typedArray => {
      let l = typedArray.length
      while (l--) {
        typedArray[l] = Math.floor(twister.random() * Math.pow(256, typedArray.BYTES_PER_ELEMENT))
      }
      return typedArray
    }
  }
}
