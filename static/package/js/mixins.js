import filter from './filters'
export default{
  data(){
    return{
      btnLoading:false,
      tableLoading:false,
      treeStatus:true,

      // 分页器
      paging:{
        totalPage: 0,
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