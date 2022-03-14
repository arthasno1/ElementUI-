import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// 设置axios请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use((config) => {
        config.headers.Authorization = sessionStorage.getItem('token')
        return config
    })
    // 树形表格组件引入和注册组件
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)

// 创建时间过滤器
import dayjs from 'dayjs'
Vue.filter('dateFormat', (originVal) => {
    return dayjs(originVal).format('YYYY-MM-DD HH:mm:ss')
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

// Vue quill editor 文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor)
new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app')