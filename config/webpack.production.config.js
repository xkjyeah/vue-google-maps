const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const config = {
  entry: [
    path.resolve('./src/main.js')
  ],
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[hash].css'
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env']
          }
        }
      },
      {
        test: /\.(css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'file-loader?name=[name].[ext]?[hash]'
        }]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  mode: process.env.NODE_ENV || 'development'
}

module.exports = config
