/* vim: set softtabstop=2 shiftwidth=2 expandtab : */
const webpack = require('webpack');
const path = require('path')

const baseConfig = {
  entry: [
    path.resolve('./src/main.js')
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: { target: 'node' }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
          /src\/stubs/,
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'file-loader?name=[name].[ext]?[hash]',
        }]
      },
    ],
  },
  mode: process.env.NODE_ENV || 'development'
}; /* baseConfig */

/**
 * Web config uses a global Vue and Lodash object.
 * */
const webConfig = {
  ...baseConfig,
  externals: {
    vue: 'Vue',
    'marker-clusterer-plus': 'MarkerClusterer'
  },
  output: {
  	path: path.resolve(__dirname, 'dist'),
    filename: "vue-google-maps.js",
    library: ["VueGoogleMaps"],
    libraryTarget: "umd"
  }
}

const stubbedConfig = {
  ...baseConfig,
  externals: {
    lodash: '_',
    'marker-clusterer-plus': 'MarkerClusterer'
  },
  module: {
    ...baseConfig.module,
    noParse: /stub-/,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "vue-google-maps-stubbed.js",
    library: ["VueGoogleMaps"],
    libraryTarget: "commonjs2"
  },
  target: 'node',
}

module.exports = [
  webConfig,
  stubbedConfig,
];
