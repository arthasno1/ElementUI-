import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import { Button, Form, FormItem, Input, Message } from 'element-ui'
// 单独引入message
Vue.prototype.$message = Message
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)