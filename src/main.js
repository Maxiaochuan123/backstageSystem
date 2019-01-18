// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import moment from 'moment'

import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
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
