const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  // Keep entry bundle unhashed (main.js) for single-spa import map,
  // but hash all lazy chunks so browser/CDN caching never serves stale chunks across builds
  singleSpaWebpackConfig.output = {
    ...singleSpaWebpackConfig.output,
    chunkFilename: '[id].[contenthash:8].js',
  };

  singleSpaWebpackConfig.optimization = {
    ...singleSpaWebpackConfig.optimization,
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
  };

  // Treat single-spa as an external dependency so mfe-auth doesn't bundle duplicate copy
  singleSpaWebpackConfig.externals = [
    ...(Array.isArray(singleSpaWebpackConfig.externals)
      ? singleSpaWebpackConfig.externals
      : [singleSpaWebpackConfig.externals].filter(Boolean)),
    'single-spa',
  ];

  return singleSpaWebpackConfig;
};
