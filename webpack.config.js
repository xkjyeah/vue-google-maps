/* vim: set softtabstop=2 shiftwidth=2 expandtab : */
var webpack = require('webpack');
var path = require('path')
var _ = require('lodash')

var baseConfig = {
  entry: [
    path.resolve('./src/main.js')
  ],
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        // edit this for additional asset file types
        test: /\.(png|jpg|gif)$/,
        loader: 'file?name=[name].[ext]?[hash]'
      }
    ],
  },
  // example: if you wish to apply custom babel options
  // instead of using vue-loader's default:
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime']
  }
}; /* baseConfig */

/**
 * Web config uses a global Vue and Lodash object.
 * */
var webConfig = _.clone(baseConfig);
webConfig.resolve = {
    alias: {
      'vue': path.resolve('./src/stubs/vue'),
      'lodash': path.resolve('./src/stubs/lodash'),
    },
};
webConfig.output = {
	path: './dist',
    filename: "vue-google-maps.js",
    library: ["VueGoogleMap"],
    libraryTarget: "umd"
};
/**
 *  npm config allows vue-google-maps to be distributed
 *  as an npm package without double-requiring vue
 * */
var npmConfig = _.clone(baseConfig);
npmConfig.resolve = {
    alias: {
      'vue': path.resolve('./src/stubs-dist/vue'),
      'lodash': path.resolve('./src/stubs-dist/lodash'),
    },
};
npmConfig.module.noParse = [
    /src[\\\/]stubs-dist/
];
npmConfig.output = {
	path: './',
    filename: "index.js",
    library: ["VueGoogleMap"],
    libraryTarget: "umd"
};

module.exports = [
    webConfig,
    npmConfig,
];


if (process.env.NODE_ENV === 'production') {
  console.log('THIS IS PROD');
  for (var i=0; i<module.exports.length; i++) {
      module.exports[i].plugins = [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
          }
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
      ]
  }
} else {
  for (var i=0; i<module.exports.length; i++) {
    module.exports[i].devtool = 'source-map'
  }
}
