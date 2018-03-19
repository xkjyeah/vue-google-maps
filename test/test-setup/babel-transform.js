// Adapted from https://github.com/nlf/lab-babel/blob/master/lib/index.js
require('babel-polyfill')
var Babel = require('babel-core')

var internals = {}
internals.transform = function (content, filename) {
  if (/^node_modules/.test(filename)) {
    return content
  }

  var transformed = Babel.transform(content, {
    filename: filename,
    sourceMap: 'inline',
    sourceFileName: filename,
    auxiliaryCommentBefore: '$lab:coverage:off$',
    auxiliaryCommentAfter: '$lab:coverage:on$',
    presets: ['es2015'],
    plugins: ['transform-object-rest-spread'],
  })

  return transformed.code
}

internals.extensions = ['js', 'jsx', 'es', 'es6']
internals.methods = []
for (var i = 0, il = internals.extensions.length; i < il; ++i) {
  internals.methods.push({ ext: internals.extensions[i], transform: internals.transform })
}

module.exports = internals.methods
