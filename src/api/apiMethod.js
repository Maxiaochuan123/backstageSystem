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
    this.publicCallback(that, apiMethod, '新增');
  },

  // 编辑 省/区域
  editRegion(that, apiMethod){
    this.publicCallback(that, apiMethod, '编辑');
  },

  publicCallback(that, apiMethod, text){
    that.btnLoading = true;
    apiMethod(that.ruleForm).then(res => {
      if (res.code == '200') {
        setTimeout(() => { that.btnLoading = false; that.dialogStatus = false; that.$message.success(`${text}成功`); }, 500);
        this.getRegion(that);
      } else {
        setTimeout(() => { that.btnLoading = false; that.dialogStatus = false; that.$message.error(`${text}失败`); }, 500);
      }
    }).catch(err => {
      setTimeout(() => { that.btnLoading = false; that.dialogStatus = false; that.$message.error(`${text}失败`); }, 500);
    })
  }
}