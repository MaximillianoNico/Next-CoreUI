const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withSourceMaps = require('@zeit/next-source-maps')();
const webpack = require('webpack');
const path = require('path');
// const withOffline = require('next-offline');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = withSass(withCss(withSourceMaps({
    // generateSw: false,
    // registerSwPrefix: '/antrian',
    // scope: '/antrian/',
    // workboxOpts: {
    //   swSrc: 'static/service-worker.js',
    //   swDest: 'static/service-worker.js'
    // },
    cssModules: true,
    env: {
      SENTRY_DSN: process.env.SENTRY_DSN
    },
    // distDir: '_antrian',
    // assetPrefix: '/antrian',
    webpack: function (cfg, { isServer, buildId }) {
        cfg.plugins.push(
          new webpack.DefinePlugin({
            'process.env.SENTRY_RELEASE': JSON.stringify(buildId)
          })
        )
        const originalEntry = cfg.entry
        cfg.entry = async () => {
          const entries = await originalEntry()
    
          if (
            entries['main.js'] &&
            !entries['main.js'].includes('./client/polyfills.js')
          ) {
            entries['main.js'].unshift('./client/polyfills.js')
          }
    
          return entries
        }

        if (!isServer) {
          cfg.resolve.alias['@sentry/node'] = '@sentry/browser'
        }

        cfg.plugins.push(
          new SWPrecacheWebpackPlugin({
            verbose: true,
            // stripPrefix: 'static/',
            // replacePrefix: '_antrian/static/',
            // filename: `${path.resolve(__dirname, 'static')}/service-worker.js`,
            // staticFileGlobsIgnorePatterns: [/\._antrian\//],
            runtimeCaching: [
              {
                handler: 'networkFirst',
                urlPattern: /^https?.*/
              }
            ]
          })
        )
    
        return cfg
      }
})));