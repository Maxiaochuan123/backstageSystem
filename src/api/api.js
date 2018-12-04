import axios from 'axios'
import storage from './storage';


export default{
  // 登录
  login(params){
    return axios.post('/zhac1/account/login', params).then(res => { storage.localSet('token', res.data.data.token); return res.data; })},

  // 查看列表
  getList(params){return axios.get('/zyjxc/waitDeal/getWaitDealDataList',  { params: params }).then(res => res.data)}
}