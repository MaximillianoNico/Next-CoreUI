const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withSourceMaps = require('@zeit/next-source-maps')();
const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
// const withOffline = require('next-offline');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = withSourceMaps(withCss(withSass({
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


      cfg.module.rules.push(
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          use: [
            {
              loader: 'emit-file-loader',
              options: {
                name: 'dist/[path][name].[ext]',
              },
            },
            {
              loader: 'url-loader',
              options: {
                limit: 100000,
              },
            },
            {
              loader: 'svg-inline-loader',
            },
          ],
        },
        {
          test: /\.(css|scss)/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            'babel-loader',
            'raw-loader',
            'postcss-loader',
            'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.s(a|c)ss$/,
          use: [
            'babel-loader',
            'raw-loader', 'postcss-loader', 'style-loader',
            {
              loader: 'sass-loader',
              options: {
                includePaths: ['styles', 'node_modules']
                  .map(d => path.join(__dirname, d))
                  .map(g => glob.sync(g))
                  .reduce((a, c) => a.concat(c), []),
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|webp)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                outputPath: 'images/',
                publicPath: '/_next/',
                name: process.env.NODE_ENV === 'development' ? '[name]-[hash].[ext]' : '[hash].[ext]',
                limit: 4000,
              },
            },
          ],
        },
      );

      // cfg.module.rules.forEach((rule) => {
      //   if (rule.test.toString().includes('.css')) {
      //     rule.rules = rule.use.map((useRule) => {
      //       if (typeof useRule === 'string') {
      //         return {
      //           loader: useRule,
      //         };
      //       }
      //       if (useRule.loader.startsWith('css-loader')) {
      //         return {
      //           oneOf: [
      //             {
      //               test: /\.global\.(css)$/,
      //               loader: useRule.loader,
      //               options: {
      //                 ...useRule.options,
      //                 modules: false,
      //               },
      //             },
      //             {
      //               loader: useRule.loader,
      //               options: useRule.options,
      //             },
      //           ],
      //         };
      //       }
      //       return useRule;
      //     });
      //     delete rule.use;
      //   }
      // });

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

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */

// Plugin Next JS
// const withOffline = require('next-offline');
// const withSass = require('@zeit/next-sass');
// const withImages = require('next-images');
// const withCss = require('@zeit/next-css');
// // const withTM = require('next-transpile-modules');
// const withOptimizedImages = require('next-optimized-images');
// const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

// // Webpack
// const glob = require('glob');
// const path = require('path');
// const webpack = require('webpack');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });
// const { parsed } = require('dotenv').config();
// const { _cfg, _combine } = require('./utils/combine');

// if (typeof require !== 'undefined') {
//   // tslint:disable-next-line:no-empty
//   require.extensions['.less'] = () => {};
//   // tslint:disable-next-line:no-empty
//   require.extensions['.css'] = () => {};
//   require.extensions['.svg'] = () => {};
// }
// console.log('localEnv', parsed);

// /**
//  * define config plugin
//  * */
// const css = cfg => withCss(
//   _cfg(cfg, {
//     cssModules: true,
//     cssLoaderOptions: {
//       url: false,
//       importLoaders: 1,
//       localIdentName: '[name]__[local]___[hash:base64:5]', // this was taken from amplify ui webpack config
//     },
//     transpileModules: [
//       'react-linkedin-login-oauth2',
//     ],
//   }),
// );
// const image = cfg => withImages(_cfg(cfg, {}));
// const sass = cfg => withSass(_cfg({
//   ...cfg,
//   exportPathMap: () => {
//     const dashboardType = ':type(create|delete|setting)';
//     return {
//       // News
//       '/': { page: '/index' },
//       '/:id': { page: '/detail-news' },
//       '/detail/:id': { page: '/detail-news' },

//       // Job
//       '/jobs/detail/:id': { page: '/detail-job' },

//       // Dashboard
//       [`/news/${dashboardType}`]: { page: '/dashboard-news' },
//       '/news/update/:idNews': { page: '/dashboard-news' },
//     };
//   },
// }, {}));
// const optimizedImage = cfg => withOptimizedImages(
//   _cfg(cfg, {
//     imagesFolder: './static',
//     optimizeImages: true,
//     optimizeImagesInDev: true,
//     mozjpeg: {
//       quality: 80,
//     },
//     optipng: {
//       optimizationLevel: 3,
//     },
//     webpack: (config) => {
//       // Fixes npm packages that depend on `fs` module
//       // eslint-disable-next-line no-param-reassign
//       config.node = {
//         fs: 'empty',
//       };

//       return config;
//     },
//   }),
// );
// // const sw = cfg => withOffline(_cfg(cfg, {
// //   generateSw: false,
// //   workboxOpts: {
// //     swDest: './service-worker.js',
// //     swSrc: path.join(__dirname, './lib/service-worker.js'),
// //     globPatterns: ['static/**/*'],
// //     globDirectory: '.',
// //   },
// // }));

// // const transpile = cfg => withTM(_cfg(cfg, {
// //   transpileModules: ['react-linkedin-login-oauth2'],
// // }));

// const bundleAnalyzer = cfg => withBundleAnalyzer(_cfg(cfg, { }));


// // generate config
// module.exports = _combine(
//   [image, sass, /** sw */, optimizedImage, css, /**transpile*/, bundleAnalyzer], {
//     webpack: (config) => {
//       config.plugins = config.plugins || [];

//       config.plugins = [
//         ...config.plugins,
//       ];

//       // Fixes npm packages that depend on `fs` module
//       config.node = {
//         fs: 'empty',
//       };

//       config.plugins.push(
//         new SWPrecacheWebpackPlugin({
//           verbose: true,
//           // filename: `${path.resolve(__dirname, 'static')}/service-worker.js`,
//           staticFileGlobsIgnorePatterns: [/\.next\//],
//           runtimeCaching: [
//             {
//               handler: 'networkFirst',
//               urlPattern: /^https?.*/,
//             },
//           ],
//         }),
//       );

//       config.plugins.push(
//         new webpack.optimize.LimitChunkCountPlugin({
//           maxChunks: 1,
//         }),
//       );

//       config.optimization.minimizer.push(
//         new OptimizeCSSAssetsPlugin({}),
//       );

//       config.module.rules.push(
//         {
//           test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
//           use: [
//             {
//               loader: 'emit-file-loader',
//               options: {
//                 name: 'dist/[path][name].[ext]',
//               },
//             },
//             {
//               loader: 'url-loader',
//               options: {
//                 limit: 100000,
//               },
//             },
//             {
//               loader: 'svg-inline-loader',
//             },
//           ],
//         },
//         {
//           test: /\.(css|scss)/,
//           use: [
//             {
//               loader: 'style-loader',
//             },
//             {
//               loader: 'css-loader',
//             },
//             {
//               loader: 'sass-loader',
//             },
//           ],
//         },
//         {
//           test: /\.css$/,
//           use: [
//             'babel-loader',
//             'raw-loader',
//             'postcss-loader',
//             'style-loader',
//             'css-loader',
//           ],
//         },
//         {
//           test: /\.s(a|c)ss$/,
//           use: [
//             'babel-loader',
//             'raw-loader', 'postcss-loader', 'style-loader',
//             {
//               loader: 'sass-loader',
//               options: {
//                 includePaths: ['styles', 'node_modules']
//                   .map(d => path.join(__dirname, d))
//                   .map(g => glob.sync(g))
//                   .reduce((a, c) => a.concat(c), []),
//               },
//             },
//           ],
//         },
//         {
//           test: /\.(png|jpe?g|gif|webp)$/i,
//           use: [
//             {
//               loader: 'url-loader',
//               options: {
//                 outputPath: 'images/',
//                 publicPath: '/_next/',
//                 name: process.env.NODE_ENV === 'development' ? '[name]-[hash].[ext]' : '[hash].[ext]',
//                 limit: 4000,
//               },
//             },
//           ],
//         },
//       );

//       config.module.rules.forEach((rule) => {
//         if (rule.test.toString().includes('.css')) {
//           rule.rules = rule.use.map((useRule) => {
//             if (typeof useRule === 'string') {
//               return {
//                 loader: useRule,
//               };
//             }
//             if (useRule.loader.startsWith('css-loader')) {
//               return {
//                 oneOf: [
//                   {
//                     test: /\.global\.(css)$/,
//                     loader: useRule.loader,
//                     options: {
//                       ...useRule.options,
//                       modules: false,
//                     },
//                   },
//                   {
//                     loader: useRule.loader,
//                     options: useRule.options,
//                   },
//                 ],
//               };
//             }
//             return useRule;
//           });
//           delete rule.use;
//         }
//       });

//       return config;
//     },
//     // Will be available on both server and client
//     publicRuntimeConfig: parsed,
//   },
// );
