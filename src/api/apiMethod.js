import api from './api'
export default{
  // 退出登陆
  loginOut(that){
    that.api.loginOut().then(res => {
      if(res.code == '200'){
        that.storage.sessionRemove('token');
        that.storage.localRemove('userInfo');
        that.$router.push("login");
      }else{
        that.$message.error(res.msg);
      }
    })
  },

  // tree 资源
  getRelationRes(that){
    that.api.getRelationRes().then(res => {
      if(res.code == '200'){
        that.relationResList = res.data;
      }else{
        that.$message.error('角色关联资源获取失败');
      }
    }).catch(err => {
      that.$message.error('角色关联资源获取失败');
    })
  },

  // 获取 机构/区域
  getRegion(that){
    this.public_getList(that, api.getRegion);
  },
  // 新增 机构/区域
  addRegion(that){
    this.public_dialog(that, api.addRegion, api.getRegion, '新增');
  },
  // 编辑 机构/区域
  editRegion(that){
    this.public_dialog(that, api.editRegion, api.getRegion, '编辑');
  },
  // 启用 / 禁用
  disabledRegion(that, scope){
    this.public_Disabled(that, api.disabledRegion, {geoId: scope.id}, scope.isEnable == 1 ? '启用' : '禁用', api.getRegion);
  },



  // 获取 组织架构
  getMechanism(that){
    this.public_getList(that, api.getMechanism);
  },
  // 新增 组织架构
  addMechanism(that){
    this.public_dialog(that, api.addMechanism, api.getMechanism, '新增');
  },
  // 编辑 组织架构
  editMechanism(that){
    this.public_dialog(that, api.editMechanism, api.getMechanism, '编辑');
  },
  // 删除 组织架构
  deleteMechanism(that, scope){
    this.public_Delete(that, api.deleteMechanism, {officeId:scope.id}, api.getMechanism, that.getMechanism);
  },
  // 启用 / 禁用
  disabledMechanism(that, scope){
    this.public_Disabled(that, api.disabledMechanism, {officeId:scope.id}, scope.isEnable == 1 ? '启用' : '禁用', api.getMechanism);
  },



  // 获取 角色
  getRole(that){
    this.public_getList(that, api.getRole);
  },
  // 新增 角色
  addRole(that){
    this.public_dialog(that, api.addRole, api.getRole, '新增');
  },
  // 编辑 角色
  editRole(that){
    this.public_dialog(that, api.editRole, api.getRole, '编辑');
  },
  // 启用 / 禁用
  disabledRole(that, scope){
    this.public_Disabled(that, api.disabledRole, {roleId:scope.id}, scope.isEnable == 1 ? '启用' : '禁用', api.getRole);
  },
  // 删除 角色
  deleteRole(that, scope){
    this.public_Delete(that, api.deleteRole, {roleId:scope.id}, api.getRole, that.getRole);
  },



  // 获取 用户
  getUser(that){
    this.public_getList(that, api.getUser);
  },
  // 获取 用户 info
  getUserInfo(that, reqData){
    api.getUserInfo(reqData).then(res=>{
      if(res.code == '200'){
        that.ruleForm = res.data;
      }else{
        setTimeout(()=>{that.$message.error('用户信息获取失败'); },500);
      }
    }).catch(err=>{
      setTimeout(()=>{that.$message.error('用户信息获取失败'); },500);
    })
  },
  // 搜索 输入条件
  serchUserList(that){
    this.public_sherchList(that, api.getUser, that.sherchForm);
  },
  
  // 新增 用户
  addUser(that){
    this.public_dialog(that, api.addUser, api.getUser, '新增');
  },
  // 编辑 用户
  editUser(that){
    this.public_dialog(that, api.editUser, api.getUser, '编辑');
  },
  // 启用 / 禁用
  disabledUser(that, scope){
    this.public_Disabled(that, api.disabledUser, {userId:scope.id}, scope.isEnable == 1 ? '启用' : '禁用', api.getUser);
  },
  

  // 获取 菜单
  getMenu(that){
    this.public_getList(that, api.getMenu);
  },
  // 新增 菜单
  addMenu(that){
    this.public_dialog(that, api.addMenu, api.getMenu, '新增');
  },
  // 编辑 菜单
  editMenu(that){
    this.public_dialog(that, api.editMenu, api.getMenu, '编辑');
  },
  // 启用 / 禁用
  disabledMenu(that, scope){
    this.public_Disabled(that, api.disabledMenu, {resourceId:scope.id}, scope.isEnable == 1 ? '启用' : '禁用', api.getMenu);
  },
  
  // 获取导航菜单
  getUserMenu(that){
    that.api.getUserMenu().then(res => {
      if(res.code == '200'){
        that.asideList = res.data;
      }else{
        that.$message.error('用户菜单获取失败');
      }
    }).catch(err => {
      that.$message.error('用户菜单获取失败');
    })
  },

  
  //删除 公共方法
  public_Delete(that, apiMethod, deleteData, getList, vuexUpList){
    that.$confirm('您确定要删除吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      that.tableLoading = true;
      apiMethod(deleteData).then(res => {
        if (res.code == '200') {
          setTimeout(() => {that.tableLoading = false; that.$message.success(`删除成功`); }, 500);
          this.public_getList(that, getList);
          vuexUpList();
        } else {
          setTimeout(() => {that.tableLoading = false; that.$message.error(`删除失败`); }, 500);
        }
      })
    })
  },

  // dialog 公共方法
  public_dialog(that, apiMethod, getList, text){
    that.btnLoading = true;
    
    apiMethod(that.ruleForm).then(res => {
      if (res.code == '200') {
        setTimeout(() => { that.resetFn(); that.$message.success(`${text}成功`); }, 500);
        this.public_getList(that, getList)
      } else {
        setTimeout(() => { that.resetFn(); that.$message.error(`${text}失败`); }, 500);
      }
    }).catch(err => {
      setTimeout(() => { that.resetFn(); that.$message.error(`${text}失败`); }, 500);
    })
  },

  // 启用/禁用 公共方法
  public_Disabled(that, apiMethod, reqData, text, getList){
    that.tableLoading = true;
    apiMethod(reqData).then(res=>{
      if(res.code == '200'){
        setTimeout(()=>{ that.tableLoading = false;  that.$message.success(`${text}成功`); },500);
        this.public_getList(that, getList);
      }else{
        setTimeout(()=>{ that.tableLoading = false; that.$message.error(`${text}失败`); },500);
      }
    }).catch(err=>{
      setTimeout(()=>{ that.tableLoading = false; that.$message.error(`${text}失败`); },500);
    })
  },

  // 搜索 公共方法
  public_sherchList(that, apiMethod){
    that.btnLoading = true;
    that.tableLoading = true;
    that.sherchForm.pageIndex = that.paging.req.pageIndex;
    that.sherchForm.pageSize = that.paging.req.pageSize;
    apiMethod(that.sherchForm).then(res=>{
      if(res.code == '200'){
        setTimeout(()=>{ that.tableLoading = false; that.btnLoading = false;},500);
        that.tableData = res.data.result;
      }else{
        setTimeout(()=>{ that.tableLoading = false; that.btnLoading = false; that.$message.error('搜索失败'); },500);
      }
    })
  },

  // 获取列表 公共方法
  public_getList(that, apiMethod){
    that.tableLoading = true;
    apiMethod(that.paging.req).then(res=>{
      if(res.code == '200'){
        setTimeout(()=>{ that.tableLoading = false;},500);
        that.tableData = res.data.result ? res.data.result : res.data;
        that.paging.totalCount = res.data.totalCount;
      }else{
        setTimeout(()=>{ that.tableLoading = false; that.$message.error('加载失败'); },500);
      }
    })
  }

}