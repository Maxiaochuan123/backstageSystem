import filter from '../../static/package/js/filters'
export default{
  data(){
    return{
      btnLoading:false,
      tableLoading:false,
      
      // 分页器
      paging:{
        totalPage: 60,
        req:{
          pageSize: 10,
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
    // 取消
    closeDialog(){
      this.resetFn();
      // console.log(this.treeStatus)
    },

    // 重置
    resetFn(){
      this.$refs['ruleForm'].resetFields();
      this.dialogStatus = false;
      this.treeStatus = false;
    },

    // 分页
    sizeChange(activePage){
      console.log(activePage)
    },
    currentChange(activePage){
      console.log(activePage)
    }
  }
}