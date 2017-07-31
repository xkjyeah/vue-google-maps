/* vim: set softtabstop=2 shiftwidth=2 expandtab : */
var webpack = require('webpack');
var path = require('path')
var _ = require('lodash')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');


var baseConfig = {
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
  plugins: [
    new LodashModuleReplacementPlugin()
  ]
}; /* baseConfig */

/**
 * Web config uses a global Vue and Lodash object.
 * */
var webConfig = _.clone(baseConfig);
webConfig.externals = {
  vue: 'Vue',
  lodash: '_',
  'marker-clusterer-plus': 'MarkerClusterer'
};
webConfig.output = {
	path: path.resolve(__dirname, 'dist'),
    filename: "vue-google-maps.js",
    library: ["VueGoogleMaps"],
    libraryTarget: "umd"
};

var stubbedConfig = _.clone(baseConfig);
stubbedConfig.externals = {
    lodash: '_',
    'marker-clusterer-plus': 'MarkerClusterer'
};
stubbedConfig.module.noParse = /stub-/
stubbedConfig.output = {
	path: path.resolve(__dirname, 'dist'),
    filename: "vue-google-maps-stubbed.js",
    library: ["VueGoogleMaps"],
    libraryTarget: "commonjs2"
};
stubbedConfig.target = 'node';


module.exports = [
    webConfig,
    stubbedConfig,
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
      ]
  }
} else {
  for (var i=0; i<module.exports.length; i++) {
    module.exports[i].devtool = 'source-map'
  }
}
