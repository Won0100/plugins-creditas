module.exports = (config, { isProd, isDev, isTest }) => {
  const path = require("path");

  config.module.rules.push({
    test: /\.(jpe?g|png|gif|webp|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
    use: ["url-loader?limit=100000"],
  });
  return {
    ...config,
    resolve: {
      ...config.resolve,
      //extensions: ['*', '.mjs', '.js', '.json'],
      modules: [path.resolve(__dirname, "./src"), ...config.resolve.modules],
    },
  };
};
