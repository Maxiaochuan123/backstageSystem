import api from './api'
export default{
  // 查看 省/区域
  getRegion(that){
    that.tableLoading = true;
    api.getRegion({type:'0'}).then(res=>{
      if(res.code == '200'){
        setTimeout(()=>{ that.tableLoading = false },500);
        that.tableData = res.data;
      }else{
        setTimeout(()=>{ that.tableLoading = false; that.$message.error('加载失败'); },500);
      }
    }).catch(err=>{
      that.$message.error('加载失败');
    })
  },

  // 新增 省/区域
  addRegion(that, apiMethod){
    that.btnLoading = true;
    apiMethod(that.ruleForm).then(res=>{
      if(res.code == '200'){
        setTimeout(()=>{ that.btnLoading = false; that.dialogStatus = false; that.$message.success('新增成功'); },500);
        this.getRegion(that);
      }else{
        setTimeout(()=>{ that.btnLoading = false; that.dialogStatus = false; that.$message.error('新增失败'); },500);
      }
    }).catch(err=>{
      that.$message.error('新增失败');
    })
  },

  // 编辑 省/区域
  editRegion(that, apiMethod){
    that.btnLoading = true;
    apiMethod(that.ruleForm).then(res=>{
      if(res.code == '200'){
        setTimeout(()=>{ that.btnLoading = false; that.dialogStatus = false; that.$message.success('编辑成功'); },500);
        this.getRegion(that);
      }else{
        setTimeout(()=>{ that.btnLoading = false; that.dialogStatus = false; that.$message.error('编辑失败'); },500);
      }
    }).catch(err=>{
      setTimeout(()=>{ that.btnLoading = false; that.dialogStatus = false; that.$message.error('编辑失败'); },500);
    })
  }
}