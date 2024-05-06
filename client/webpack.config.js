const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js',
      // editor: './src/js/editor.js',
      // header:'./src/js/header.js'
    },
    devServer: {
      allowedHosts: 'all',
      compress: true,
      hot: true,
      port: 3001,
      // Other valid properties...
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      // Webpack plugin that generates our html file and injects our bundles. 
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Jate'
      }),
      // Creates a manifest.json file.
      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: 'Jate Info',
        short_name: 'Jate',
        description: 'Never forget your Jate!',
        background_color: '#225ca3',
        theme_color: '#225ca3',
        start_url: './',
        publicPath: './',
        display:'standalone',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 144, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
          {
            src: path.resolve('favicon.ico'),
            sizes: [96, 128, 144, 192, 256, 384, 512],
          },
        ],
      }),
      // Injects our custom service worker
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js',
      }),
    ],

    module: {
     // CSS loaders
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
          type:'asset/resource',
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          // We use babel-loader in order to use ES6.
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'],
            },
          },
        },
      ],
    },
  };
};
