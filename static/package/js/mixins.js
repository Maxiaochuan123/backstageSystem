import filter from './filters'

export default{
  data(){
    return{
      btnLoading:false,
      tableLoading:false,
      treeStatus:true,

      // 分页器
      paging:{
        totalCount: 0,
        req:{
          pageSize: 15,
          pageIndex: 1
        }
      }
    }
  },
  filters: {
    dictionariesFilter(text, name){
      return filter.dictionariesFilter(text, name);
    }
  },
  computed:{
    switchStatu(){
      return (data, status1, status2) => {
        return data == 1 ? status1 : status2
      }
    }
  },
  methods: {

    // 获取 机构
    getMechanism(){
      this.api.getMechanism().then(res=>{
        if(res.code == '200'){
          this.$store.commit('setMechanismList',res.data);
        }else{
          setTimeout(()=>{ this.$message.error('机构列表加载失败'); },500);
        }
      }).catch(err=>{
        this.$message.error('机构列表加载失败');
      })
    },

    // 获取 大区
    getRegion(){
      this.api.getRegion().then(res=>{
        if(res.code == '200'){
          this.$store.commit('setCompanyList',res.data);
          this.$store.commit('setLargeAreaList',res.data);
        }else{
          setTimeout(()=>{ this.$message.error('大区列表加载失败'); },500);
        }
      }).catch(err=>{
        this.$message.error('大区列表加载失败');
      })
    },

    recursionRelation(data){
      data.map(item => {
        if(item.isEnable == 1){
          item.disabled = true;
        }else{
          item.disabled = false;
        }
        if(item.children){
          this.recursionRelation(item.children);
        }
      })
    },
    // 获取角色关联资源(菜单)
    getRelationRes(){
      this.api.getMenu().then(res=>{
        if(res.code == '200'){
          let relationResList = res.data;
          setTimeout(()=>{this.recursionRelation(relationResList);},500)
          this.$store.commit('setRelationResList', relationResList);
        }else{
          setTimeout(()=>{ this.$message.error('角色关联资源加载失败'); },500);
        }
      }).catch(err=>{
        this.$message.error('角色关联资源加载失败');
      })
    },

    // 获取 用户角色
    getRole(){
      this.api.getRole().then(res=>{
        if(res.code == '200'){
          let userRoleList = [];
          res.data.result.forEach(item => {
            userRoleList.push({label:item.roleName,value:item.id,isEnable:item.isEnable});
          });
          this.$store.commit('setUserRoleList',userRoleList);
        }else{
          setTimeout(()=>{ this.$message.error('用户角色列表加载失败'); },500);
        }
      }).catch(err=>{
        this.$message.error('用户角色列表加载失败');
      })
    },

    // 获取 用户菜单
    getUserMenu(){
      this.api.getUserMenu().then(res=>{
        if(res.code == '200'){
          this.$store.commit('setAsideList',res.data);
        }else{
          setTimeout(()=>{ this.$message.error('用户菜单加载失败'); },500);
        }
      }).catch(err=>{
        this.$message.error('用户菜单加载失败');
      })
    },

    // 时间戳返回日期
    formatDate(row) {
      return this.moment(row.createdStamp).format('YYYY-MM-DD');
    },

    // 取消
    closeDialog(){
      this.resetFn();
    },

    // 重置
    resetFn(){
      this.$refs['ruleForm'].resetFields();
      this.dialogStatus = false;
      this.btnLoading = false;
      this.treeStatus = false;
    },

    // 分页
    sizeChange(activePage){
      this.paging.req.pageSize = activePage;
      this.changePaging();
    },
    currentChange(activePage){
      this.paging.req.pageIndex = activePage;
      this.changePaging();
    }
  }
}