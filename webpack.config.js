const path = require('path');

module.exports = {
    module: {
      entry: './src/index.js',
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
      },
      module: {
        loaders: [
          {
            test: /\.xml$/,
            loader: 'xml-loader',
          }
        ]
      }
    },
  };