// 导入 path 模块
const path = require('path')

// 自定义主题的文件路径
const themePath = path.join(__dirname, './src/theme.less')

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            // 通过 less 文件覆盖（文件路径为绝对路径）
            hack: `true; @import "${themePath}";`
          }
        }
      }
    }
  },
  // 增强 vue-cli 的 webpack 配置项
  configureWebpack: {
    // 打包优化
    externals: {
      // import 时的包名称: window 全局的成员名称
      'highlight.js': 'hljs',
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
      vant: 'vant',
      dayjs: 'dayjs',
      'socket.io-client': 'io',
      popmotion: 'popmotion'
    }
  },
  publicPath: './',
  assetsDir: 'static',
  parallel: false
})
