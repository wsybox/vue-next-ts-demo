const path = require('path')
const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const CopyPlugin = require('copy-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const $ = require('./constant')

module.exports = {
  lintOnSave: true,
  runtimeCompiler: true,
  productionSourceMap: false,
  outputDir: path.resolve($.projectPath, './dist'),
  configureWebpack: config => {
    const filename = `js/[name]${$.isDev ? '' : '.[hash:8]'}.js`
    config.output = Object.assign(config.output, {
      filename,
      chunkFilename: filename
    })

    config.plugins = [
      ...config.plugins,
      new WebpackBar({
        name: `正在${$.isDev ? '启动' : '打包'}`,
        color: '#409eff',
      }),
      $.isOpenHardSource && new HardSourceWebpackPlugin(),
      !$.isDev && new CleanWebpackPlugin(),
      (!$.isDev && $.shouldOpenAnalyzer) && new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8888,
      })
    ].filter(Boolean)

  },
  chainWebpack: config => {
    for (let item of ['js', 'ts', 'tsx']) {
      config.module.rule(item)
        .use('babel-loader')
        .options({ cacheDirectory: true })
        .end()
    }

    config.plugin('html').tap(args => {
      args[0] = Object.assign(args[0], {
        title: $.title,
        template: path.resolve($.projectPath, './public/index.html'),
        filename: 'index.html',
        cache: false, // 修改代码刷新页面为空问题
        minify: $.isDev ? false : {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          removeComments: true,
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
          useShortDoctype: true,
        },
      })
      return args
    })

    config.plugin('fork-ts-checker').tap(args => {
      args[0].typescript.configFile = path.resolve($.projectPath, './tsconfig.json')
      return args
    })

    config.optimization.minimizer('terser').tap(args => {
      args[0].terserOptions.compress.drop_console = !$.isDev

      return args
    })
  },
  // 配置转发代理
  devServer: !$.isDev ? undefined : {
    disableHostCheck: true,
    // host: $.serverHost,
    port: $.serverPort, // 默认是8080
    stats: 'errors-only', // 终端仅打印 error
    compress: true, // 是否启用 gzip 压缩
    open: true // 打开默认浏览器
  }
}
