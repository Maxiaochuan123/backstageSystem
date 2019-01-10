// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import moment from 'moment'
import Qs from 'qs';

import ElementUI from 'element-ui';
import { Loading, Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/iconfont/iconfont.css';

import store from './vuex/store';
import mixins from '../static/package/js/mixins';

import api from './api/api';
import apiMethod from './api/apiMethod';
import tool from '../static/package/js/tool';
import storage from '../static/package/js/storage';
import imagesPath from '../static/package/js/imagesPath';
import dictionaries from '../static/package/js/dictionaries';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.mixin(mixins);

Vue.prototype.moment = moment; //日期处理
Vue.prototype.api = api; //接口
Vue.prototype.apiMethod = apiMethod; //接口方法
Vue.prototype.tool = tool; //工具
Vue.prototype.storage = storage; //本地存储
Vue.prototype.imagesPath = imagesPath; //图片路径
Vue.prototype.dictionaries = dictionaries; //字典


// // 超时时间
// axios.defaults.timeout = 5000;

// /*----------------------请求拦截----------------------*/
// // let loadinginstace;
// axios.interceptors.request.use(config => {

//   // element ui Loading方法
//   // loadinginstace = Loading.service({
//   //   fullscreen: true
//   // });

//   // 参数序列化
//   if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
//     config.data = Qs.stringify(config.data);
//   };

//   // 携带 token
//   let token = storage.sessionGet('token');
//   if (token && config.url !== '/zhac1/account/login') {
//     let token = storage.sessionGet(token);
//     tool.decAse192(token,'token')
//     config.headers.token = token;
//   }
//   return config;
// }, error => {
//   // loadinginstace.close();
//   Message.error({
//     message: '加载超时'
//   })
//   return Promise.reject(error);
// })

// /*----------------------响应拦截----------------------*/
// axios.interceptors.response.use(data => { // 响应成功关闭loading
//   // setTimeout(() => loadinginstace.close(), 500)
//   return data
// }, error => {
//   // loadinginstace.close()
//   Message.error({
//     message: '加载失败'
//   })
//   return Promise.reject(error)
// })

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
