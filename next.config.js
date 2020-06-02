module.exports = {
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.xml/,
        use: [
          options.defaultLoaders.babel,
          {
            loader: 'xml-loader'
          },
        ],
      })
  
      return config
    },
  }