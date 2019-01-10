import axios from 'axios'
import Qs from 'qs';
import {
  Loading,
  Message
} from 'element-ui';
import storage from '../../static/package/js/storage';
import tool from '../../static/package/js/tool'

export default {
  // 登录
  login(params) {
    return axios.post('/zhac1/account/login', params).then(res => {
      if (res.data.code == 'SYS.200') {
        let token = tool.encAse192(res.data.data.token, 'token');
        storage.sessionSet('token', token);
      }
      return res.data;
    })
  },

  // 查看 省/区域
  getRegion(params) {
    return axios.get('/user/geo/get/list', {
      params: params
    }).then(res => res.data)
  },
  // 新增 省/区域
  addRegion(params) {
    return axios.post('/user/geo/insert', params).then(res => res.data)
  },
  // 编辑 省/区域
  editRegion(params) {
    return axios.put('/user/geo/update/geo', params).then(res => res.data)
  },

  // 启用 / 禁用
  changeStatus(params) {
    return axios.post('/user/geo/update/state', params).then(res => res.data)
  },

  // 上传
  upLoaod(params) {
    return axios.post('/param/web/appra/carDealerDoc/uploadFile', params, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(res => res.data)
  },

}



























// 超时时间
axios.defaults.timeout = 5000;

/*----------------------请求拦截----------------------*/
// let loadinginstace;
axios.interceptors.request.use(config => {

  // element ui Loading方法
  // loadinginstace = Loading.service({
  //   fullscreen: true
  // });

  // 参数序列化
  if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
    config.data = Qs.stringify(config.data);
  };

  // 携带 token
  // let token = storage.sessionGet('token');
  // if (token && config.url !== '/zhac1/account/login') {
  //   let token = storage.sessionGet(token);
  //   tool.decAse192(token,'token')
  //   config.headers.token = token;
  // }
  return config;
}, error => {
  // loadinginstace.close();
  Message.error({
    message: '加载超时'
  })
  return Promise.reject(error);
})

/*----------------------响应拦截----------------------*/
axios.interceptors.response.use(response => { // 响应成功关闭loading
  // setTimeout(() => loadinginstace.close(), 500)
  return response
}, error => {
  // loadinginstace.close()
  Message.error({
    message: error.response.data.message
  })
  return Promise.reject(error)
})