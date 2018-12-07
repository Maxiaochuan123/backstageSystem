// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import Qs from 'qs';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/iconfont/iconfont.css'
import store from './vuex/store'
import api from './api/api';
import tool from './api/tool';
import storage from './api/storage';
import mixins from './api/mixins';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.mixin(mixins)
Vue.prototype.api = api; //接口
Vue.prototype.tool = tool; //工具
Vue.prototype.storage = storage; //本地存储 

/*----------------------请求拦截----------------------*/
axios.interceptors.request.use(config => {
    // 参数序列化
    if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
      config.data = Qs.stringify(config.data);
    }

    // 携带 token
    let token = storage.localGet('token')
    if (token && config.url !== '/zhac1/account/login') {
      config.headers.token = token;
    }

    return config;
  }
)


/*----------------------响应拦截----------------------*/
const _vue = new Vue();
axios.interceptors.response.use(response => {
  if (response.data.code === 200) {
    router.replace('/login');
    _vue.$message.warning = '登陆信息已过期，请重新登陆';
  }

  return response;
}, error => {

  if (error && error.response) {
    switch (error.response.status) {
      case 300:
        _vue.$message.warning = '请求错误';
        break;
      case 400:
        _vue.$message.warning = '请求错误';
        break;

      case 401:
        _vue.$message.warning = '未授权，请登录';
        break;

      case 403:
        _vue.$message.warning = '拒绝访问';
        break;

      case 404:
        _vue.$message.warning = '请求地址出错';
        break;

      case 408:
        _vue.$message.warning = '请求超时';
        break;

      case 500:
        _vue.$message.warning = '服务器内部错误';
        break;

      case 501:
        _vue.$message.warning = '服务未实现';
        break;

      case 502:
        _vue.$message.warning = '网关错误';
        break;

      case 503:
        _vue.$message.warning = '服务不可用';
        break;

      case 504:
        _vue.$message.warning = '网关超时';
        break;

      case 505:
        _vue.$message.warning = 'HTTP版本不受支持';
        break;

      default:
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
