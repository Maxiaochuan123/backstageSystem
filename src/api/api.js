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
  // 角色关联资源
  getRelationRes() { return axios.get('/user/resources/get/tree').then(res => res.data) },


  // 获取 机构/区域
  getRegion(params) { return axios.get('/user/geo/get/list', {params: params}).then(res => res.data) },
  // 新增 机构/区域
  addRegion(params) { return axios.post('/user/geo/insert', params).then(res => res.data) },
  // 编辑 机构/区域
  editRegion(params) { return axios.post('/user/geo/update/geo', params).then(res => res.data) },
  // 启用 / 禁用
  disabledRegion(params) { return axios.post('/user/geo/update/state', params).then(res => res.data) },


  // 获取 组织架构
  getMechanism(params) { return axios.get('/user/office/get/list', {params: params}).then(res => res.data) },
  // 新增 组织架构
  addMechanism(params) { return axios.post('/user/office/insert/office', params).then(res => res.data) },
  // 编辑 组织架构
  editMechanism(params) { return axios.post('/user/office/update/office', params).then(res => res.data) },
  // 删除 组织架构
  deleteMechanism(params) { return axios.post('/user/office/delete/office', params).then(res => res.data) },
  // 启用 / 禁用
  disabledMechanism(params) { return axios.post('/user/office/update/enable', params).then(res => res.data) },


  // 获取 角色
  getRole(params) { return axios.get('/user/role/get/role/list', {params: params}).then(res => res.data) },
  // 新增 角色
  addRole(params) { return axios.post('/user/role/insert/role', params).then(res => res.data) },
  // 编辑 角色
  editRole(params) { return axios.post('/user/role/update/role', params).then(res => res.data) },
  // 删除 角色
  deleteRole(params) { return axios.post('/user/role/delete/role', params).then(res => res.data) },
  // 启用 / 禁用
  disabledRole(params) { return axios.post('/user/role/update/enable', params).then(res => res.data) },


  // 获取 用户
  getUser(params) { return axios.get('/user/get/list', {params: params}).then(res => res.data) },
  // 获取 角色info (编辑时,数据要拿 id 去后台查, 真尼玛B垃圾...)
  getUserInfo(params) { return axios.get('/user/get/user/info', {params: params}).then(res => res.data) },
  // 新增 用户
  addUser(params) { return axios.post('/user/insert/user', params).then(res => res.data) },
  // 编辑 用户
  editUser(params) { return axios.post('/user/update/user', params).then(res => res.data) },
  // 启用 / 禁用
  disabledUser(params) { return axios.post('/user/update/user/enable', params).then(res => res.data) },
  

  // 获取 菜单
  getMenu(params) { return axios.get('/user/resources/get/resources', {params: params}).then(res => res.data) },
  // 新增 菜单
  addMenu(params) { return axios.post('/user/resources/insert/resources', params).then(res => res.data) },
  // 编辑 菜单
  // editMenu(params) { return axios.post('/user/role/update/role', params).then(res => res.data) },
  // 启用 / 禁用
  // disabledMenu(params) { return axios.post('/user/role/update/enable', params).then(res => res.data) },







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