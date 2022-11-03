module.exports = {
  lintOnSave: false,
  chainWebpack: (config) => {
    config.when(process.env.NODE_ENV === 'production', (config) => {
      config.entry('app').clear().add('./src/main.js')
      config.set('externals', {
        vue: 'Vue',
        'element-ui': 'ELEMENT',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
    })
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.entry('app').clear().add('./src/main.js')
    })
  }
}
