import axios from 'axios'
import Qs from 'qs';
import { Message } from 'element-ui';
import storage from '../../static/package/js/storage';
import tool from '../../static/package/js/tool'

export default {
  // 登录
  login(params) {
    return axios.post('/user/login', params).then(res => {
      if (res.data.code == '200') {
        let token = tool.encAse192(res.data.data.token, 'token');
        storage.sessionSet('token', token);
        storage.sessionSet('userInfo', res.data.data);
      }
      return res.data;
    })
  },
  // 退出登陆
  loginOut(params){ return axios.post('/user/logout', params).then(res => res.data)},
  
  // 征信报单转化率
  getCreditReporting(params) { return axios.get('bi/creditConverRate/findCreditConverRate', {params: params}).then(res => res.data) },
  // 导出
  creditConverRateExport(params) { return axios.post('bi/creditConverRate/expoler/creditConverRate', params, {responseType: 'blob'} ).then(res => res.data) },

  // 大数据流水
  getAccountflowList(params) { return axios.post('bi/accountflow/list', params).then(res => res.data) },
  // 导出
  accountflowListExport(params) { return axios.post('bi/accountflow/list/export', params, {responseType: 'blob'} ).then(res => res.data) },

  // 大数据流水账单
  getAccountflowBill(params) { return axios.post('bi/accountflow/bill', params).then(res => res.data) },
  // 导出
  accountflowBillExport(params) { return axios.post('bi/accountflow/bill/export', params, {responseType: 'blob'} ).then(res => res.data) },

  // bi/creditConverRate/expoler/creditConverRate
  // 上传
  // upLoaod(params) {
  //   return axios.post('/param/web/appra/carDealerDoc/uploadFile', params, {
  //     headers: {
  //       "Content-Type": "multipart/form-data"
  //     }
  //   }).then(res => res.data)
  // },

}











// 超时时间
axios.defaults.timeout = 5000;

/*----------------------请求拦截----------------------*/
axios.interceptors.request.use(config => {

  // 参数序列化
  // if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
  //   config.data = Qs.stringify(config.data);
  // };

  // 携带 token
  let token = storage.sessionGet('token');
  if (token && config.url !== '/user/login') {
    token = tool.decAse192(token,'token');
    config.headers.token = token;
    
  }
  return config;
}, error => {
  Message.error({
    message: '加载超时'
  })
  return Promise.reject(error);
})

/*----------------------响应拦截----------------------*/
axios.interceptors.response.use(response => {
  return response
}, error => {
  Message.error({
    message: error.response.data.message
  })
  return Promise.reject(error)
})