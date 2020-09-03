const path = require('path')
const WebpackBar = require('webpackbar')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const glob = require('glob')
// const PurgeCSSPlugin = require('purgecss-webpack-plugin')
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
      // !$.isDev && new PurgeCSSPlugin({
      //   paths: glob.sync(`${path.resolve($.projectPath, './src')}/**/*.{vue,tsx,ts,js,scss,less,css}`),
      // }),
      // !$.isDev && new MiniCssExtractPlugin({
      //   filename: 'css/[name].[contenthash:8].css',
      //   chunkFilename: 'css/[name].[contenthash:8].css',
      //   ignoreOrder: false,
      // }),
      // gzip压缩
      !$.isDev && new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
        threshold: 10240, // 只有大小大于该值的资源会被处理 10240
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        deleteOriginalAssets: false // 删除原文件
      }),
      (!$.isDev && $.shouldOpenAnalyzer) && new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8888,
      })
    ].filter(Boolean)

    if (!$.isDev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        name: true
      }
    }
  },
  chainWebpack: config => {
    ['js', 'ts', 'tsx'].forEach(rule => {
      config.module.rule(rule)
        .use('babel-loader')
        .options({ cacheDirectory: true })
        .end()
    })

    if (!$.isDev) {
      // ['css', 'scss', 'less'].forEach(rule => {
      //   ['vue-modules', 'vue', 'normal-modules', 'normal'].forEach(type => {
      //     const loader = config.module.rule(rule).oneOf(type)
      //     loader.uses.clear()
      //     loader
      //       .use(`${rule}-loader`)
      //       // .loader(MiniCssExtractPlugin.loader)
      //       .loader('vue-style-loader')
      //       .loader('css-loader')
      //       .tap(args => ({
      //         modules: false,
      //         sourceMap: false,
      //         importLoaders: rule === 'css' ? 1 : 2,
      //       }))
      //       .loader('postcss-loader')
      //       .tap(args => ({
      //         ident: 'postcss',
      //         plugins: [
      //           // 修复一些和 flex 布局相关的 bug
      //           require('postcss-flexbugs-fixes'),
      //           require('postcss-preset-env')({
      //             autoprefixer: {
      //               grid: true,
      //               flexbox: 'no-2009'
      //             },
      //             stage: 3,
      //           }),
      //           require('postcss-normalize'),
      //         ],
      //         sourceMap: false,
      //       }))

      //       switch(rule) {
      //         case 'scss':
      //           loader.use(`${rule}-loader`).loader('sass-loader').tap(args => ({
      //             sourceMap: false
      //           })); break;
      //         case 'less':
      //           loader.use(`${rule}-loader`).loader('less-loader').tap(args => ({
      //             sourceMap: false
      //           })); break;
      //         default: break;
      //       }

      //       loader.end()
      //   })
      // })
    }

    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({ bypassOnDebug: true })
      .end()

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
  css: {
    loaderOptions: {
      postcss: {
        ident: 'postcss',
        plugins: [
          // 修复一些和 flex 布局相关的 bug
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              grid: true,
              flexbox: 'no-2009'
            },
            stage: 3,
          }),
          require('postcss-normalize'),
        ],
      }
    }
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
