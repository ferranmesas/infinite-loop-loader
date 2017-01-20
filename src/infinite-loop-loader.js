'use strict'

const falafel = require('falafel')
const transformLoopWithLimit = require('./transformLoopWithLimit.js')

module.exports = function (source) {
  this.cacheable(false)

  const options = this.loaders[this.loaderIndex].options
  const limit = options && options.limit || 1e9
  const fn = transformLoopWithLimit(limit)
  const opts = options && options.opts || {
    allowImportExportEverywhere: true
  }

  const output = falafel(source, opts, fn)
  return output.toString()
}
