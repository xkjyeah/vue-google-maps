import webpack from 'webpack'

export default new Promise((resolve, reject) => {
  const webpackConfig = require('../../webpack.config.js')[0]

  webpack(
    webpackConfig,
    (err, status) => {
      if (!err) {
        resolve()
      } else {
        reject(err)
      }
    }
  )
})
