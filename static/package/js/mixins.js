export default{
  data(){
    return{
      btnLoading:false,
      tableLoading:false,

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
  methods: {

    // 取消
    closeDialog(){
      this.reset();
    },

    // 重置
    reset(){
      this.$refs['ruleForm'].resetFields();
      this.dialogStatus = false;
      this.btnLoading = false;
    },

    // 分页
    sizeChange(activePage){
      this.paging.req.pageSize = activePage;
      this.changePaging();
    },
    currentChange(activePage){
      this.paging.req.pageIndex = activePage;
      this.changePaging();
    },

    // 时间戳返回日期
    formatDate(date) {
      return this.moment(date).format('YYYY-MM-DD');
    },

    // 删除日期中的 -
    removeLine(dataStr){
      return dataStr.replace(/-/g, '');
    },
  }
}