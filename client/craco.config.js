const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // 1. Remove deprecated middleware options at the very beginning
      if (webpackConfig.devServer) {
        delete webpackConfig.devServer.onBeforeSetupMiddleware;
        delete webpackConfig.devServer.onAfterSetupMiddleware;
        
        // Use the new setupMiddlewares API
        webpackConfig.devServer.setupMiddlewares = (middlewares) => {
          return middlewares;
        };
      }

      // 2. Resolve aliases
      webpackConfig.resolve.alias = {
        ...(webpackConfig.resolve.alias || {}),
        'process/browser': path.resolve(__dirname, 'node_modules/process/browser.js'),
        'stream': path.resolve(__dirname, 'node_modules/stream-browserify')
      };

      // 3. Add fallbacks for Node.js core modules
      webpackConfig.resolve.fallback = {
        ...(webpackConfig.resolve.fallback || {}),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "path": require.resolve("path-browserify"),
        "url": require.resolve("url/"),
        "assert": require.resolve("assert/"),
        "process": require.resolve("process/browser"),
        "vm": require.resolve("vm-browserify"),
        "events": require.resolve("events/"),
        "buffer": require.resolve("buffer/"),
        "fs": false,
        "https": require.resolve("https-browserify"),
        "http": require.resolve("stream-http"),
        "zlib": require.resolve("browserify-zlib"),
        "querystring": require.resolve("querystring-es3"),
        "net": false,
        "tls": false,
        "child_process": false,
        "http2": false
      };

      // 4. Add plugins for global polyfills
      webpackConfig.plugins = [
        ...(webpackConfig.plugins || []),
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
          Stream: ['stream-browserify', 'Stream'] 
        })
      ];

       // Add plugins
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
        })
      ];

      // 5. Handle source map warnings
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        { module: /node_modules\/@truffle\// },
        { module: /node_modules\/web3-eth-contract\// },
        /Failed to parse source map/,
        /Critical dependency/
      ];

        // Add CSP nonce support
      if (process.env.NODE_ENV === 'development') {
        webpackConfig.plugins.push(
          new webpack.SourceMapDevToolPlugin({
            append: `\n//# sourceMappingURL=[url]`,
            filename: `[file].map`,
          })
        );
      }

      // 6. Add source-map-loader rule with exclusions
      const sourceMapLoaderRule = {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: [
          /node_modules\/@truffle\//,
          /node_modules\/web3-eth-contract\//,
          /node_modules\/nofilter\//,
          /node_modules\/cbor\//
        ]
      };
      
      // Add to existing rules without overwriting
      webpackConfig.module.rules.push(sourceMapLoaderRule);

      return webpackConfig;
    }
  },
  eslint: {
    enable: true,
    mode: "extends"
  },
  devServer: (devServerConfig) => {
    // Add security headers
    devServerConfig.headers = {
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://*.firebaseio.com https://*.infura.io;"
    };
    return devServerConfig;
  }
};