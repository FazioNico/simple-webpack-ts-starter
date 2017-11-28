/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   28-11-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 28-11-2017
 */

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
// const DashboardPlugin = require("webpack-dashboard/plugin");
var JavaScriptObfuscator = require('webpack-obfuscator');
var HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin
var pkg = require('./package.json')

const nodeEnv = process.env.NODE_ENV || "development";

var SRC_PATH = path.resolve('./src')
var DIST_PATH = path.resolve('./dist')

var hmrConfig = {
  multiStep: true
}

var commonConfig = {
  context: SRC_PATH,
  entry: {
    app: "./main.ts",
    vendor:'./vendor.ts'// Object.keys(pkg.dependencies || {})//.push('vendor.ts')// "./vendor.ts"
  },
  output: {
    path: DIST_PATH,
    filename: "[name].bundle.[chunkhash].js",
    sourceMapFilename: "[name].bundle.map",
    chunkFilename: '[chunkhash].js'
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.ts?$/,
        exclude: ["node_modules"],
        use: ["awesome-typescript-loader", "source-map-loader"]
      },
      { test: /\.html$/, loader: "html-loader" },
      { test: /\.css$/, loaders: ["style-loader", "css-loader"] }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // eslint-disable-line quote-props
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    }),
    new HotModuleReplacementPlugin(hmrConfig),
    new HtmlWebpackPlugin({
      title: "Simple Typescript Webpack Starter",
      template: "!!ejs-loader!src/index.html"
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        tslint: {
          emitErrors: true,
          failOnHint: true
        }
      }
    }),
    new webpack.optimize.CommonsChunkPlugin(
    {
      name: "vendor",
      minChunks: Infinity,
      filename: "vendor.bundle.js"
    }),
    //new DashboardPlugin(),
  ]
};

function getDevPlugins() {
  return [
    ...commonConfig.plugins,
    new UglifyJSPlugin({ uglifyOptions: { } })
  ];
}

function getProdPlugins() {
  return [
    ...commonConfig.plugins,
    new UglifyJSPlugin({ uglifyOptions: {
      compress: { warnings: false },
      output: { comments: false },
      sourceMap: true
    }}),
    new JavaScriptObfuscator ({
      rotateUnicodeArray: true}
      //['excluded_bundle_name.js']
    ),
    new webpack.optimize.ModuleConcatenationPlugin()
  ];
}

var devConfig = {
  devtool: "source-map",
  output: {
    devtoolModuleFilenameTemplate: function (info) {
        return "file:///" + info.absoluteResourcePath;
    }
  },
  plugins: getDevPlugins(),
  devServer: {
    contentBase: DIST_PATH,
    compress: true,
    port: 4200,
    hot: true
  }
}

var prodConfig = {
  plugins: getProdPlugins(),
}

module.exports = (env)=> {
  // define production check const
  const isProduction = env.prod === true;
  console.log('[info] Webpack build production mode-> ',isProduction);
  // return new object assign with commonConfig + {env}Config
  return (isProduction)
    ? Object.assign({}, commonConfig, prodConfig)
    : Object.assign({}, commonConfig, devConfig);
}
