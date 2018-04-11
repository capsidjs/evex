if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/evex')
} else {
  module.exports = require('./dist/evex.dev')
}
