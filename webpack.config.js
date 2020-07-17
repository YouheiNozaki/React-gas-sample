const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const GasPlugin = require('gas-webpack-plugin');
const Es3ifyPlugin = require('es3ify-webpack-plugin');

// Config
const destination = 'dist';
const isDev = process.env.NODE_ENV !== 'production';

// Bundle Dialog Template HTML
const htmlPlugin = new HtmlWebpackPlugin({
  template: './src/client/index.html',
  filename: 'index.html',
  inlineSource: '.(js|css)$', // embed all javascript and css inline
});

/*      Shared Config
================================== */

const sharedConfigSettings = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true,
        sourceMap: isDev,
        terserOptions: {
          ie8: true, // Necessary for GAS compatibility
          mangle: false, // Necessary for GAS compatibility
          ecma: undefined,
          module: false,
          toplevel: false,
          nameCache: null,
          keep_classnames: undefined,
          safari10: false,
          parse: {},
          compress: {},
          keep_fnames: isDev,
          warnings: isDev,
          output: {
            beautify: isDev,
            comments: isDev,
          },
        },
      }),
    ],
  },
  module: {},
};

/*    Google Apps Script Config
================================== */

const appsscriptConfig = {
  name: 'COPY APPSSCRIPT.JSON',
  entry: './appsscript.json',
  plugins: [
    new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: [destination] }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './appsscript.json',
        },
      ],
    }),
  ],
};

/*          Client Config
================================== */

const clientConfig = Object.assign({}, sharedConfigSettings, {
  name: 'CLIENT',

  entry: './src/client/index.tsx',
  output: {
    path: path.resolve(__dirname, destination),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [
    htmlPlugin,
    new HtmlWebpackInlineSourcePlugin(),
    new GasPlugin(),
    new Es3ifyPlugin(),
  ],
});

module.exports = [appsscriptConfig, clientConfig];
