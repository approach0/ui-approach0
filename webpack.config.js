const { dependencies } = require('./package.json')
var webpack = require('webpack')

/* HTML template engine */
const HtmlWebpackPlugin = require('html-webpack-plugin')

/* vue-loader 15 requires a webpack plugin to function */
const { VueLoaderPlugin } = require('vue-loader')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')

/* listen port */
const PORT = 19985

module.exports = (env, options) => {
  const mode = options.mode;
  console.log(`[ this is ${mode} mode, listen port = ${PORT} ]`);

  return {
    /* default is development mode, run 'yarn run build' for production. */
    mode: mode,
    entry: { /* required field */
      light: __dirname + '/node_modules/primevue/resources/themes/md-light-indigo/theme.css',
      night: __dirname + '/node_modules/primevue/resources/themes/md-dark-indigo/theme.css',
      app: __dirname + '/main.js'
    },
    output: { /* required field */
      filename: '[name].bundle.js'
    },
    resolve: {
      extensions: ['.js', '.vue']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              options: { presets: ["@babel/preset-env"] }
            }
          ]
        },
        { test: /\.vue$/, enforce: 'pre', use: 'eslint-loader', exclude: /node_modules/},
        { test: /\.vue$/, use: 'vue-loader' },
        { test: /\.css$/, use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            }
          },
          //'style-loader', /* this is conflict with MiniCssExtractPlugin.loader */
          'css-loader',
          /* need both here to both inject the CSS and
           * convert CSS to JavaScript module. */
        ]},
        { test: /\.s(c|a)ss$/, use: [
          'vue-style-loader', 'css-loader',
          {
            loader: 'sass-loader',
            // Requires sass-loader@^7.0.0
            options: {
              implementation: require('sass'),
              fiber: require('fibers'),
              indentedSyntax: true // optional
            },
            // Requires sass-loader@^8.0.0
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
                indentedSyntax: true // optional
              },
            },
          }

        ]},
        { test: /\.styl$/, use: [
          'style-loader', 'css-loader', 'stylus-loader'
        ]},
        {
          test: /\.(eot|woff|woff2|svg|ttf|otf)([\?]?.*)$/,
          use: [{
            loader: 'file-loader',
            options: {
              outputPath: 'fonts/'
            }
          }]
        },
      {
      test: /\.(jpe?g|png|gif|svg)$/i,
          use: [{
            loader: 'file-loader',
            options: {
              esModule: false
            }
          }]
      }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Approach Zero',
        favicon: "./resource/favicon.ico",
        chunks: ['app'], /* stop injecting css */
        inject: true,
        hash: true, /* cache busting */
        template: __dirname + '/index.template.html',
        filename: 'index.html' /* default goes to ./dist */
      }),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new PreloadWebpackPlugin({
        rel: 'preload',
        as: 'font',
        include: 'allAssets',
        fileWhitelist: [/\.(woff2?|eot|ttf|otf)(\?.*)?$/i],
      }),
      new webpack.DefinePlugin({
        A0_RELAY_URL: JSON.stringify(mode === 'production' ? process.env.A0_RELAY_URL : 'http://localhost:8080'),
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false
      })
    ],
    devServer: {
      contentBase: __dirname + '/dist',
      port: PORT,
      historyApiFallback: true /* make history-mode routing possible */
    }
  };
}
