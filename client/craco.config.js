// client/craco.config.js
const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add process/browser alias
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'process/browser': path.resolve(__dirname, 'node_modules/process/browser.js')
      };

      module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "vm": require.resolve("vm-browserify")
      };
      return webpackConfig;
    }
  }
};

      module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.js$/,
            enforce: "pre",
            use: ["source-map-loader"],
            exclude: /node_modules\/@truffle\/contract/
          }
        ]
      }
    }
  }
};

      // Add fallbacks
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "path": require.resolve("path-browserify"),
        "url": require.resolve("url/"),
        "assert": require.resolve("assert/"),
        "process": require.resolve("process/browser")
      };

      // Add plugins
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
        })
      ];

      return webpackConfig;
    }
  }
};