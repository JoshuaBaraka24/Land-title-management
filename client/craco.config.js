// client/craco.config.js
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify"),
          "os": require.resolve("os-browserify/browser"),
          "path": require.resolve("path-browserify"),
          "url": require.resolve("url/"),
          "assert": require.resolve("assert/")
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      ]
    }
  }
};