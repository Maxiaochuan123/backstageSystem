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
import api from './api/api';
import tool from './api/tool';
import storage from './api/storage';


Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.prototype.api = api; //接口
Vue.prototype.tool = tool; //工具
Vue.prototype.storage = storage; //本地存储 

const _vue = new Vue();

console.log(_vue)
/*----------------------请求拦截----------------------*/
axios.interceptors.request.use(
  config => {
    // 参数序列化
    if(config.method === 'post' || config.method === 'put' || config.method === 'delete'){
      config.data = Qs.stringify(config.data);
    }

    // 携带 token
    let token = storage.localGet('token')
    if(token && config.url !== '/zhac1/account/login'){
      config.headers.token = token;
    }
    
    return config;
  }
)


/*----------------------响应拦截----------------------*/
// axios.defaults.timeout = 5000; //超时范围
// axios.defaults.retry = 4; //重复次数
// axios.defaults.retryDelay = 1000; //重复间隔
axios.interceptors.response.use(response => {
  if(response.data.code === 200){
    router.replace('/login'); 
    Message.warning = '登陆信息已过期，请重新登陆';
  }
  // console.log('response',response)
    
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

    // 请求超时处理
    // var config = error.config;

    // if(!config || !config.retry) return Promise.reject(error);

    // config.__retryCount = config.__retryCount || 0;

    // if(config.__retryCount >= config.retry) {
    //     return Promise.reject(error);
    // }
  
    // config.__retryCount += 1;
  
    // var backoff = new Promise((resolve) =>{
    //     setTimeout(() => {
    //         resolve();
    //     }, config.retryDelay || 1);
    // });
  
    // return backoff.then(() =>{
    //     return axios(config);
    // });
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
