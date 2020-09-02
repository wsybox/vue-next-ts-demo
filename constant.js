const path = require('path')

const _ = {
  proxyUrl: 'http://localhost:3000',
  title: 'Vue3.0+Typescript 快速开框架',
  isDev: process.env.NODE_ENV !== 'production',
  serverHost: 'localhost',
  serverPort: 9000,
  projectPath: path.resolve(__dirname, './'),
  isOpenHardSource: true, // 是否开启 modules 缓存
  shouldOpenAnalyzer: false, // 是否开启 bundle 包分析
}

_.projectName = path.parse(_.projectPath).name

module.exports = _
