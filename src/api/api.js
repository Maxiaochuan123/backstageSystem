import axios from 'axios'
import storage from './storage';
import tool from './tool'

export default{
  // 登录
  login(params){
    return axios.post('/zhac1/account/login', params).then(res => { 
      if(res.data.code == 'SYS.200'){
        let token = tool.encAse192(res.data.data.token,'token');
        storage.sessionSet('token', token);
      }
      return res.data; 
    })
  },

  // 查看列表
  getList(params){return axios.get('/zyjxc/waitDeal/getWaitDealDataList',  { params: params }).then(res => res.data)},
  
  // 上传
  upLoaod(params){return axios.post('/param/web/appra/carDealerDoc/uploadFile', params, {headers:{"Content-Type": "multipart/form-data"}}).then(res => res.data)},
}