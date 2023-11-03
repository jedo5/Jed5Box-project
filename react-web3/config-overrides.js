module.exports = override = (config, env) => {
    //do stuff with the webpack config...
    let loaders = config.resolve;
    loaders.fallback = {
        fs: false,
        net: false,
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        url: require.resolve("url"),
        // os: require.resolve('os-browserify/browser'),
    }
    return config;
  }