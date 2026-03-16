const path = require('path')
const env = process.env.NODE_ENV

const config = require(`./config/webpack.${env}.config`)

/**
 * Web config uses a global Vue and Lodash object.
 * */
const webConfig = {
  ...config,
  externals: {
    vue: 'Vue',
    'marker-clusterer-plus': 'MarkerClusterer'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vue-google-maps.js',
    library: ['VueGoogleMaps'],
    libraryTarget: 'umd'
  }
}

module.exports = [
  webConfig
]
