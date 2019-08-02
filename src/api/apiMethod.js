import api from './api'
import tool from '../../static/package/js/tool'
export default{

  // 征信 列表 (公司/详情)
  getCreditReporting(that){
    this.public_sherchList(that, api.getCreditReporting)
  },

  // 大数据流水
  getAccountflowList(that){
    this.public_sherchList(that, api.getAccountflowList)
  },


  // 大数据流水账单
  getAccountflowBill(that){
    this.public_sherchList(that, api.getAccountflowBill)
  },
  

  // 大数据流水(导出)
  exportExcel(that, excelName){
    this.public_exportExcel(that, excelName);
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
        that.paging.totalCount = res.data.totalCount;
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
        that.tableData = res.data.result;
        that.paging.totalCount = res.data.totalCount;
      }else{
        setTimeout(()=>{ that.tableLoading = false; that.$message.error('加载失败'); },500);
      }
    })
  },

  // 导出 公共方法
  public_exportExcel(that, excelName){
    let exportMethod = "";
    switch (excelName){
      case "征信报单转化率(详情表)":
          exportMethod = api.creditConverRateExport;
        break;
      case "大数据流水":
          exportMethod = api.accountflowListExport;
        break;
      case "大数据流水(账单)":
          exportMethod = api.accountflowBillExport;
        break;
    }
    exportMethod(that.sherchForm).then((res)=>{
      tool.downloadExcel(that, res, excelName);
    })
  },

  // 退出登陆
  loginOut(that){
    that.api.loginOut().then(res => {
      if(res.code == '200'){
        sessionStorage.clear();
        that.storage.localRemove('userInfo');
        that.$router.push("login");
      }else{
        that.$message.error(res.msg);
      }
    })
  }

}